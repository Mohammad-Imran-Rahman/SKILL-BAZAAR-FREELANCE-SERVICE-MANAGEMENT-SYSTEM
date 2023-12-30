import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import Stripe from "stripe";
import { productImageUpload } from "../utils/cloudinary.js";

export const placeOrder = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    const newOrder = new Order({
      gigId: gig._id,
      buyerId: req.userId,
      sellerId: gig.userId,
    });
    const result = await newOrder.save();
    if (result) res.status(201).send("Order has been created.")
  } catch (error) {
    next(error)
  }
}

export const handleStatus = async (req, res, next) => {
  if (req.file){
      req.body.work = await productImageUpload(req.file, `Fiver/Works`)
      req.body.isCompleted = 'Delivered'
  }
  console.log(req.body)
  try {
    if (req.isSeller) {
      const updateOrder = await Order.findByIdAndUpdate(req.params.id, {
        $set:  {...req.body} 
      },
      {
        new: true
      })
      if (updateOrder) res.status(200).send("Order status has been update.")
    }
  } catch (error) {
    next(error)
  }
}

export const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET);
  try {
    const order = await Order.findById(req.params.id).populate("gigId");
    const lineItems = [{
      price_data: {
        currency: "usd",
        product_data: {
          name: order.gigId.title
        },
        unit_amount: Math.round(order.gigId.price * 100),
      },
      quantity: 1,
    }]
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["US", "CA", 'BD'] },
      payment_method_types: ["card"],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/canceled`,
    });
    if (session) {
      const updateOrder = await Order.findByIdAndUpdate(order._id, {
        $set: { total: order.gigId.price - ((15 / 100) * order.gigId.price), stripeId: session.id }
      },
        {
          new: true
        })
      if (updateOrder) return res.status(200).json({ stripeSession: session });
    }
  } catch (err) {
    next(err);
  }

};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      // isCompleted: true,
    }).populate('gigId').populate('buyerId').sort({ updatedAt: -1 });

    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};

export const getOrderDetails = async (req, res, next) => {
  try {
    const orders = await Order.findById(req.params.id).populate('gigId', "-sales").populate('buyerId', "-password").populate('sellerId', "-password");
    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};

export const confirm = async (req, res, next) => {
  try {
    const orders = await Order.findOneAndUpdate(
      {
        stripeId: req.body.order_intend,
      },
      {
        $set: {
          isCompleted: 'Completed',
        },
      },
      {
        new: true
      }
    );
    const order = await Order.findOne({ stripeId: req.body.order_intend });
    await Gig.findByIdAndUpdate(
      order.gigId,
      {
        $inc: { sales: 1 }
      },
      {
        new: true
      }
    )
    res.status(200).send("Order has been confirmed.");
  } catch (err) {
    next(err);
  }
};

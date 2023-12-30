import React from "react";
import "./Slide.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "black" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "black" }}
      onClick={onClick}
    />
  );
}

const Slide = ({ children, slidesToShow, arrowsScroll }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: arrowsScroll,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    // responsive: [
    //   {
    //     breakpoint: 1024,
    //     settings: {
    //       slidesToShow: 3,
    //       slidesToScroll: 3,
    //       infinite: true,
    //       dots: true
    //     }
    //   },
    //   {
    //     breakpoint: 600,
    //     settings: {
    //       slidesToShow: 2,
    //       slidesToScroll: 2,
    //       initialSlide: 2
    //     }
    //   },
    //   {
    //     breakpoint: 480,
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1
    //     }
    //   }
    // ]
  };
  return (
    <div className="slide">
      <div className="container">
        <Slider {...settings} /*, slidesToShow= slidesToShow, slidesToScroll=arrowsScroll} slidesToShow={slidesToShow} arrowsScroll={arrowsScroll}*/>
          {children}
        </Slider>
      </div>
    </div>
  );
};

export default Slide;

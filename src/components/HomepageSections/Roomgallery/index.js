import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Roomgallery extends Component {
  render() {
    return (
      <section className="room-gallery-cta" style={{ backgroundImage: "url(/airport.jpg)" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="cta-text text-center">
                <span>our rooms</span>
                <h2> Each of our nine lovely double guest rooms feature a private bath, wi-fi, cable television and include full breakfast. </h2>
                <ul className="mt-50">
                  <li><Link className="main-btn btn-filled" to="/room-details/1">take a tour</Link></li>
                  <li><Link className="main-btn btn-border" to="/about-us">Learn More</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="rotate-images">
          <img 
            alt='room-gallery-1' 
            src={"/room-gallery-1.jpg"}
            onError={
                ({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src="/no-image.png";
                }
            } 
            className="rotate-image-one" />
          <img 
            alt='room-gallery-2' 
            src={"/room-gallery-2.jpg"}
            onError={
                ({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src="/no-image.png";
                }
            } 
            className="rotate-image-two" />
          <img 
            src={"/room-gallery-3.jpg"}
            alt='room-gallery-3'
            onError={
                ({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src="/no-image.png";
                }
            } 
            className="rotate-image-three" />
        </div>
      </section>
    );
  }
}

export default Roomgallery;
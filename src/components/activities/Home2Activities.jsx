"use client";
import React, { useMemo, useState } from "react";
import ModalVideo from "react-modal-video";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
} from "swiper";
import Link from "next/link";
SwiperCore.use([Autoplay, EffectFade, Navigation, Pagination]);

const Home2Activities = () => {
  const [isOpen, setOpen] = useState(false);
  const settings = useMemo(() => {
    return {
      slidesPerView: "auto",
      speed: 1500,
      spaceBetween: 25,
      effect: "fade", // Use the fade effect
      loop: true,
      fadeEffect: {
        crossFade: true, // Enable cross-fade transition
      },
      autoplay: {
        delay: 2500, // Autoplay duration in milliseconds
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination5",
        clickable: true,
      },
    };
  });
  return (
    <>
      <div className="slider-and-tab-section mb-120">
        <div className="row g-0">
          <div className="col-lg-5">
            <ul className="activities-slider-group">
              <li className="active">
                <div className="slider-area">
                  <Swiper
                    {...settings}
                    className="swiper activities-img-slider"
                  >
                    <div className="swiper-wrapper">
                      <SwiperSlide className="swiper-slide">
                        <div
                          className="slide-img"
                          style={{
                            backgroundImage:
                              "linear-gradient(180deg, rgba(16, 12, 8, 0.4) 0%, rgba(16, 12, 8, 0.4) 100%), url(assets/img/Ajwa/Tent-ajwa.jpg)",
                          }}
                        />
                      </SwiperSlide>
                      <SwiperSlide className="swiper-slide">
                        <div
                          className="slide-img"
                          style={{
                            backgroundImage:
                              "linear-gradient(180deg, rgba(16, 12, 8, 0.4) 0%, rgba(16, 12, 8, 0.4) 100%), url(assets/img/Ajwa/Tent2-ajwa.jpg)",
                          }}
                        />
                      </SwiperSlide>
                    </div>
                  </Swiper>
                  <div className="swiper-pagination5 pagination1" />
                </div>
              </li>
            </ul>
          </div>
          <div className="col-lg-7">
            <div className="tab-area">
              <div className="section-title2 text-center mb-50">
                {/* <div className="eg-section-tag">
                  <span>What We Do</span>
                </div> */}
                <h2>Services we Provide</h2>
              </div>
              <div className="tab-content-area">
                <div className="row g-xl-4 gy-5 ">
                  <div className="col-xl-5">
                    <div className="tab-sidebar">
                      <ul
                        className="nav nav-pills"
                        id="pills-tab3"
                        role="tablist"
                      >
                        <li className="nav-item" role="presentation">
                          <div
                            className="nav-link active"
                            id="flight-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#flight"
                            role="tab"
                            aria-controls="flight"
                            aria-selected="true"
                            style={{ height: '5vh', justifyContent: 'center' }}
                          >
                            <h6>Flight Tickets</h6>
                          </div>
                        </li>
                        <li className="nav-item" role="presentation">
                          <div
                            className="nav-link"
                            id="visa-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#visa"
                            role="tab"
                            aria-controls="visa"
                            aria-selected="false"
                            style={{ height: '5vh', justifyContent: 'center' }}
                          >
                            <h6>Visas</h6>
                          </div>
                        </li>
                        <li className="nav-item" role="presentation">
                          <div
                            className="nav-link"
                            id="recruitment-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#recruitment"
                            role="tab"
                            aria-controls="recruitment"
                            aria-selected="false"
                            style={{ height: '5vh', justifyContent: 'center' }}
                          >
                            <h6>Recruitment</h6>
                          </div>
                        </li>
                        <li className="nav-item" role="presentation">
                          <div
                            className="nav-link"
                            id="umrah-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#umrah"
                            role="tab"
                            aria-controls="umrah"
                            aria-selected="false"
                            style={{ height: '5vh', justifyContent: 'center' }}
                          >
                            <h6>Umrah &amp; Hajj</h6>
                          </div>
                        </li>
                        <li className="nav-item" role="presentation">
                          <div
                            className="nav-link"
                            id="studyAbroad-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#studyAbroad"
                            role="tab"
                            aria-controls="studyAbroad"
                            aria-selected="false"
                            style={{ height: '5vh', justifyContent: 'center' }}
                          >
                            <h6>Study Abroad</h6>
                          </div>
                        </li>
                        <li className="nav-item" role="presentation">
                          <div
                            className="nav-link"
                            id="document-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#document"
                            role="tab"
                            aria-controls="document"
                            aria-selected="false"
                            style={{ height: '5vh', justifyContent: 'center' }}
                          >
                            <h6>Document Attestation</h6>
                          </div>
                        </li>
                        <li className="nav-item" role="presentation">
                          <div
                            className="nav-link"
                            id="tours-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#tours"
                            role="tab"
                            aria-controls="tours"
                            aria-selected="false"
                            style={{ height: '5vh', justifyContent: 'center', paddingRight: '0px', paddingLeft: '0pxs' }}
                          >
                            <h6>Tours and Travel Packages</h6>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-xl-7 d-flex justify-content-xl-start justify-content-center">
                    <div className="tab-content" id="pills-tab3Content">
                      <div
                        className="tab-pane fade show active"
                        id="flight"
                        role="tabpanel"
                        aria-labelledby="flight-tab"
                      >
                        <div className="tab-content-wrap">
                          <h2>Seamless Skies: Your Flight Ticket Awaits</h2>
                          <p>
                            Book your journey effortlessly and soar to your destination with ease. Enjoy competitive fares, smooth bookings, and a hassle-free travel experience. Let your adventure take flight today.
                          </p>
                          <ul>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Best Deals & Competitive Pricing
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Flexible Booking Options
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Secure & Reliable
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Global Destinations
                            </li>
                          </ul>
                          <div className="content-bottom-area">
                            <Link
                              href="/services"
                              className="primary-btn3"
                            >
                              See what we provide
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="visa"
                        role="tabpanel"
                        aria-labelledby="visa-tab"
                      >
                        <div className=" tab-content-wrap">
                          <h2>
                            Hassle-Free Visas: Your Gateway to the World
                          </h2>
                          <p>
                            Simplify your travel with seamless visa assistance. From application to approval, we ensure a smooth process so you can focus on your journey. Let us handle the paperwork while you prepare for your adventure.
                          </p>
                          <ul>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Expert Guidance
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Smooth & Fast Processing
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Visas for Multiple Destinations
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Hassle-Free Documentation
                            </li>
                          </ul>
                          <div className="content-bottom-area">
                            <Link
                              href="/services"
                              className="primary-btn3"
                            >
                              Contact Us
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="recruitment"
                        role="tabpanel"
                        aria-labelledby="recruitment-tab"
                      >
                        <div className=" tab-content-wrap">
                          <h2>Career Gateway: Your Job Recruitment Partner</h2>
                          <p>
                            Unlock exciting job opportunities with our expert recruitment services. Whether you're seeking your dream job or hiring top talent, we connect the right people to the right roles effortlessly.
                          </p>
                          <ul>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Global Job Opportunities
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Tailored Job Matching
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Hassle-Free Documentation
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Trusted Recruitment Process
                            </li>
                          </ul>
                          <div className="content-bottom-area">
                            <Link
                              href="/services"
                              className="primary-btn3"
                            >
                              Contact Us
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="umrah"
                        role="tabpanel"
                        aria-labelledby="umrah-tab"
                      >
                        <div className=" tab-content-wrap">
                          <h2>
                            Spiritual Journeys: Umrah & Hajj Packages
                          </h2>
                          <p>
                            Embark on a blessed journey with our carefully curated Umrah and Hajj packages. Experience a hassle-free pilgrimage with expert guidance, comfortable accommodations, and seamless travel arrangements.
                          </p>
                          <ul>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Customized Packages
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Flights & Accommodation
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Spiritual Guidance
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Visa & Documentation Assistance
                            </li>
                          </ul>
                          <div className="content-bottom-area">
                            <Link
                              href="/services"
                              className="primary-btn3"
                            >
                              Contact Us
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="studyAbroad"
                        role="tabpanel"
                        aria-labelledby="studyAbroad-tab"
                      >
                        <div className=" tab-content-wrap">
                          <h2>
                            Study Abroad: Your Global Education Journey
                          </h2>
                          <p>
                            Turn your dream of studying abroad into reality with our expert guidance. From university selection to visa assistance, we ensure a smooth transition to your international education journey.
                          </p>
                          <ul>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Top Universities & Courses
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Hassle-Free Admission Process
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Visa & Documentation Support
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Global Study Destinations
                            </li>
                          </ul>
                          <div className="content-bottom-area">
                            <Link
                              href="/services"
                              className="primary-btn3"
                            >
                              Contact Us
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="document"
                        role="tabpanel"
                        aria-labelledby="document-tab"
                      >
                        <div className=" tab-content-wrap">
                          <h2>
                            Document Attestation: Fast & Reliable Services
                          </h2>
                          <p>
                            Get your documents attested seamlessly for international use. We ensure a hassle-free process with authentication from relevant authorities, making your paperwork valid worldwide.
                          </p>
                          <ul>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Educational & Personal Documents
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Embassy & Government Attestation
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Fast & Secure Processing
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Accepted Worldwide
                            </li>
                          </ul>
                          <div className="content-bottom-area">
                            <Link
                              href="/services"
                              className="primary-btn3"
                            >
                              Contact Us
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="tours"
                        role="tabpanel"
                        aria-labelledby="tours-tab"
                      >
                        <div className=" tab-content-wrap">
                          <h2>
                            Explore the World: Customized Tours & Travel Packages
                          </h2>
                          <p>
                            Discover breathtaking destinations with our expertly crafted travel packages. Whether it’s a relaxing getaway or an adventure-filled trip, we ensure a seamless and unforgettable experience.
                          </p>
                          <ul>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Worldwide Destinations
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Flights & Accommodation
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Tailored Itineraries
                            </li>
                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                              >
                                <circle cx="4.5" cy="4.5" r="4.5" />
                              </svg>
                              Expert Travel Assistance
                            </li>
                          </ul>
                          <div className="content-bottom-area">
                            <Link
                              href="/services"
                              className="primary-btn3"
                            >
                              Contact Us
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <React.Fragment>
          <ModalVideo
            channel="youtube"
            onClick={() => setOpen(true)}
            isOpen={isOpen}
            animationSpeed="350"
            videoId="r4KpWiK08vM"
            ratio="16:9"
            onClose={() => setOpen(false)}
          />
        </React.Fragment>
      </div>
    </>
  );
};

export default Home2Activities;

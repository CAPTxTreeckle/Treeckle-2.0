import React, { useContext, useEffect } from "react";
import {
  Container,
  Button,
  Transition,
  Grid,
  Icon,
  Segment,
  Divider,
  Image,
  Loader,
} from "semantic-ui-react";
import { useInView } from "react-intersection-observer";
import { useCountUp } from "use-count-up";
import { useShowScroller } from "../../../custom-hooks";
import treeckleLogo from "../../../assets/treeckle-outline-min.png";
import { Media, UserContext } from "../../../context-providers";
import SignInButton from "../../sign-in-button";
import { useGetTotalBookingCount } from "../../../custom-hooks/api";
import { scrollToTop } from "../../scroll-to-top-wrapper";
import "./home-page.scss";

function HomePage() {
  const {
    totalBookingCount,
    isLoading,
    getTotalBookingCount,
  } = useGetTotalBookingCount();

  const { updateUser } = useContext(UserContext);
  const { ref, inView } = useInView({ delay: 250 });
  const { value, reset } = useCountUp({
    isCounting: inView,
    start: 0,
    end: totalBookingCount,
    duration: 4,
    autoResetKey: totalBookingCount,
  });
  const { showScroller } = useShowScroller(300);

  useEffect(() => {
    updateUser(null);
  }, [updateUser]);

  useEffect(() => {
    getTotalBookingCount();
  }, [getTotalBookingCount]);

  useEffect(() => {
    if (!inView) {
      reset(0);
    }
  }, [inView, reset]);

  return (
    <div id="home-page">
      <div className="home-banner">
        <Transition animation="scale" transitionOnMount>
          <div className="header-container">
            <Image className="logo" src={treeckleLogo} alt="" />
            <h1 className="main-title">TREECKLE</h1>
            <p className="subtitle">Residential life. Simplified.</p>
            <SignInButton />
          </div>
        </Transition>
        <Media className="home-video-container" greaterThanOrEqual="tablet">
          <video
            autoPlay
            loop
            muted
            playsInline
            src={require("../../../assets/utown-video.mp4")}
          />
        </Media>
      </div>

      <Segment className="home-highlights" vertical>
        <Container>
          <h1 className="title">
            THE INTEGRATED PLATFORM THAT SERVES YOUR NEEDS
          </h1>
          <Grid columns="3" centered stackable relaxed padded="vertically">
            <Grid.Column textAlign="center">
              <Icon className="icon" name="home" />
              <h3>FACILITIES BOOKING</h3>
              <p>
                Redefined by Treeckle, booking facilities and approvals can now
                be done seamlessly
              </p>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <Icon className="icon" name="calendar alternate outline" />
              <h3>COLLEGE EVENTS</h3>
              <p>
                Digitized events are easier than ever to find, and simplifies
                creation for event organizers
              </p>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <Icon className="icon" name="plus" />
              <h3>THE SKY'S THE LIMIT</h3>
              <p>You get to decide what we build next</p>
            </Grid.Column>
          </Grid>
        </Container>
      </Segment>

      <Segment className="home-mission" vertical>
        <Container className="mission">
          <h1>MISSION</h1>
          <p>
            At Treeckle, we believe in creating scalable digital experiences to
            enhance the Residential College experience at NUS.
          </p>
        </Container>
      </Segment>

      <Segment vertical>
        <Container>
          <div className="title">
            <h1>VISION</h1>
            <p>
              To empower each and every resident with technology to be able to
              achieve their goals with greater efficiency.
            </p>
          </div>

          <Grid columns="3" centered stackable relaxed padded="vertically">
            <Grid.Column textAlign="center">
              <h1>
                {isLoading ? (
                  <Loader active inline size="medium" />
                ) : (
                  <div ref={ref}>{value}</div>
                )}
              </h1>
              <p>Facility bookings facilitated in total</p>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <h1>User-Specific</h1>
              <p>Events recommendation system</p>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <h1>Deployable</h1>
              <p>Across all five Residential Colleges</p>
            </Grid.Column>
          </Grid>
        </Container>
      </Segment>

      <Segment inverted vertical className="home-footer">
        <Container>
          <Grid columns="2" centered stackable padded="vertically">
            <Grid.Column textAlign="center">
              <h2>ABOUT TREECKLE</h2>
              <p>
                Treeckle is a student-initiated project, built with the aim of
                making a difference through a web application.
              </p>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <h2>CONTACT US</h2>
              <p>
                <a
                  className="email-link"
                  href="mailto:treeckle@googlegroups.com"
                >
                  <Icon name="mail" /> Email
                </a>
              </p>
            </Grid.Column>
          </Grid>
          <Divider section />
          <p>© Treeckle 2020</p>
        </Container>
      </Segment>

      <Transition visible={showScroller} animation="scale" duration="300">
        <Button
          className="scroll-to-top-button"
          color="teal"
          onClick={() => scrollToTop("smooth")}
          icon="arrow up"
          circular
          size="massive"
          aria-label="scroll to top"
        />
      </Transition>
    </div>
  );
}

export default HomePage;

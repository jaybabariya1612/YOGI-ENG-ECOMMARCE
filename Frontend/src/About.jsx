import { Link } from "react-router-dom";
import "./Style.css";
import "./Media.css";

const About = () => {
  return (
    <>
      <div className="about_section">
        <div className="about_section_left">
          <img src="images/about us.jpg" alt="About Us - Yogi Engineering" />
        </div>
        <div className="about_section_right">
          <h6>ABOUT US</h6>
          <h1>Favourite Online Tools Shop</h1>
          <p>
            Founded in the year 2014, we “Yogi Engineering” are a dependable and
            famous manufacturer of a broad range of Vibratory Motor, Bench
            Grinder, Cooling Tower Motor, Electric Brake Motor, Torque Motor,
            Foot Mounted Motor, etc. We provide these products in diverse
            specifications to attain the complete satisfaction of the clients.
            We are a Sole Proprietorship company located in Ahmedabad
            (Gujarat, India) and have built a wide and well-functional
            infrastructure unit where we manufacture these products as per the
            global set standards. Under the supervision of “Mr. Vasant”
            (Proprietor), we have gained a huge clientele in our country.
          </p>
          <Link to="/Contact">CONTACT US</Link>
        </div>
      </div>
    </>
  );
};

export default About;

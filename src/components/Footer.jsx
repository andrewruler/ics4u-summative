import './Footer.css'; 

function Footer() {
  return (
    <footer>
      <h1>Questions?</h1>
      <p className="contact">Contact us at: <a href="mailto:3gkKZ@example.com">3gkKZ@example.com</a></p>
      <p>© 2022 Cineflix. All rights reserved.</p>

      <ul>
        <li><a href="about.html">About</a></li>
        <li><a href="help.html">Help</a></li>
        <li><a href="terms.html">Terms</a></li>
        <li><a href="privacy.html">Privacy</a></li>
      </ul>
    </footer>
  );
}

export default Footer;

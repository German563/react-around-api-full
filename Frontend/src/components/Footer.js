function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer__copyright">© {currentYear} Around The U.S.</p>
    </footer>
  );
}

export default Footer;

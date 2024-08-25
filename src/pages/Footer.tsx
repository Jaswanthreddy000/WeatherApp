import React from 'react';

interface FooterProps {
  style?: React.CSSProperties;
}

const Footer: React.FC<FooterProps> = ({ style }) => {
  return (
    <footer style={style} className="bg-gray-800 text-white py-4 w-full sticky bottom-0">
      <div className="container mx-auto text-center">
        <p>© 2024 Weather Forecast. All rights reserved.</p>
        <ul className="flex justify-center space-x-4 mt-2">
          <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
          <li><a href="/terms-of-service" className="hover:underline">Terms of Service</a></li>
          <li><a href="/contact-us" className="hover:underline">Contact Us</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;

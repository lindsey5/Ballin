const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
        
        {/* Logo / Brand */}
        <div className="flex flex-col items-start md:items-start">
          <h1 className="text-2xl font-bold">Ballin Life & Style</h1>
          <p className="text-gray-400 text-sm mt-1">© {new Date().getFullYear()} Ballin. All rights reserved.</p>
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-6">
          <a href="/" className="hover:text-purple-400 transition">Home</a>
          <a href="/terms" className="hover:text-purple-400 transition">Terms</a>
          <a href="/privacy-policy" className="hover:text-purple-400 transition">Privacy Policy</a>
        </div>

        {/* Social Icons */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-4 md:mt-0">
          <a href="https://www.facebook.com/Ballinmnl" className="hover:text-purple-400 transition" target="_blank">Facebook</a>
          <a href="https://www.tiktok.com/@ballinwear2.0?lang=en" className="hover:text-purple-400 transition" target="_blank">TikTok</a>
        </div>

      </div>
    </footer>
  );
};

export default Footer
"use client";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-700 to-green-800 text-white mt-20 shadow-inner"
    style={{position:"absolute", bottom:"0", width:"100%"}}>
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side - Brand */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold mb-2">🌾 AgriToken</h2>
          <p className="text-sm text-gray-200 leading-relaxed">
            Empowering Farmers • Fair Trade • Blockchain Transparency
          </p>
        </div>

        {/* Center Links */}
        <div className="flex flex-col md:flex-row justify-center items-center md:space-x-10 space-y-3 md:space-y-0">
          <a href="/" className="hover:text-yellow-300 transition">Home</a>
          <a href="/marketplace" className="hover:text-yellow-300 transition">Marketplace</a>
          <a href="/dashboard/farmer" className="hover:text-yellow-300 transition">Farmer</a>
          <a href="/dashboard/buyer" className="hover:text-yellow-300 transition">Buyer</a>
        </div>

        {/* Right Side - Social Media */}
        <div className="flex justify-center md:justify-end space-x-6">
          <a href="#" className="hover:scale-110 transform transition">
            <svg className="w-6 h-6 fill-current hover:text-sky-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24 4.56c-.883.392-1.83.656-2.828.774a4.93 4.93 0 002.165-2.724c-.95.562-2.005.971-3.127 1.193a4.918 4.918 0 00-8.384 4.482C7.691 7.72 4.066 5.148 1.64 1.641a4.822 4.822 0 00-.666 2.475c0 1.708.87 3.216 2.19 4.099a4.903 4.903 0 01-2.228-.616v.062c0 2.385 1.693 4.374 3.946 4.827a4.935 4.935 0 01-2.224.084c.627 1.956 2.444 3.379 4.6 3.422A9.867 9.867 0 010 19.54 13.945 13.945 0 007.548 22c9.142 0 14.307-7.721 13.995-14.646A9.936 9.936 0 0024 4.56z"/></svg>
          </a>
          <a href="#" className="hover:scale-110 transform transition">
            <svg className="w-6 h-6 fill-current hover:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22.676 0H1.326C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.326 24h11.494v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.763v2.313h3.588l-.467 3.622h-3.121V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.676 0"/></svg>
          </a>
          <a href="#" className="hover:scale-110 transform transition">
            <svg className="w-6 h-6 fill-current hover:text-pink-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.849.07 1.366.062 2.633.35 3.608 1.325.975.975 1.263 2.242 1.325 3.608.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.062 1.366-.35 2.633-1.325 3.608-.975.975-2.242 1.263-3.608 1.325-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07c-1.366-.062-2.633-.35-3.608-1.325-.975-.975-1.263-2.242-1.325-3.608C2.175 15.646 2.163 15.266 2.163 12s.012-3.584.07-4.849c.062-1.366.35-2.633 1.325-3.608.975-.975 2.242-1.263 3.608-1.325C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.775.13 4.638.423 3.678 1.383 2.718 2.343 2.425 3.48 2.367 4.757 2.309 6.037 2.295 6.446 2.295 12c0 5.554.014 5.963.072 7.243.058 1.277.351 2.414 1.311 3.374.96.96 2.097 1.253 3.374 1.311 1.28.058 1.689.072 7.243.072s5.963-.014 7.243-.072c1.277-.058 2.414-.351 3.374-1.311.96-.96 1.253-2.097 1.311-3.374.058-1.28.072-1.689.072-7.243s-.014-5.963-.072-7.243c-.058-1.277-.351-2.414-1.311-3.374C21.362.423 20.225.13 18.948.072 17.668.014 17.259 0 12 0z"/><path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8z"/><circle cx="18.406" cy="5.594" r="1.44"/></svg>
          </a>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-green-600 text-center py-4 text-sm text-gray-200">
        © {new Date().getFullYear()} AgriToken • All rights reserved.
      </div>
    </footer>
  );
}

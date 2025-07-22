export default function Footer() {
  const COSMIC_BUCKET_SLUG = process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG || 'screenshot-app'

  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900">Screenshot Capture</span>
            </div>
            <p className="text-slate-600">
              Capture high-quality screenshots from any website URL and save them to your Cosmic bucket media library.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Features
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li>• URL Screenshot Capture</li>
              <li>• Cosmic Media Integration</li>
              <li>• RESTful API Endpoint</li>
              <li>• High-Quality Images</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.cosmicjs.com/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-slate-900"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a 
                  href="https://www.cosmicjs.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-slate-900"
                >
                  Cosmic CMS
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} Screenshot Capture Service. All rights reserved.
          </p>
          
          <a
            href={`https://www.cosmicjs.com?utm_source=bucket_${COSMIC_BUCKET_SLUG}&utm_medium=referral&utm_campaign=app_footer&utm_content=built_with_cosmic`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cosmic-dark hover:bg-cosmic-dark-hover text-white px-4 py-2 rounded-md text-sm font-medium no-underline inline-flex items-center gap-2 transition-colors duration-200 mt-4 md:mt-0"
          >
            <img 
              src="https://cdn.cosmicjs.com/b67de7d0-c810-11ed-b01d-23d7b265c299-logo508x500.svg" 
              alt="Cosmic Logo" 
              className="w-5 h-5"
            />
            Built with Cosmic
          </a>
        </div>
      </div>
    </footer>
  )
}
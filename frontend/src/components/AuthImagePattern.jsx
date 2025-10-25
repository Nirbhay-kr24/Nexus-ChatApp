const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-white p-12">
      <div className="max-w-md text-center">
        <div className="mb-6 relative">
          
          <div className="mx-auto h-56 w-full max-w-sm">
              <img
                src="/animation.svg"
                alt="Chat assistant illustration"
                onError={(e) => (e.currentTarget.src = '/Animation.gif')}
                className="w-full h-full object-contain rounded-lg drop-shadow-lg animate-fade-in"
              />
          </div>

          
        </div>

        <h2 className="text-2xl font-bold mb-3 text-base-content">{title}</h2>
        <p className="text-base-content/70">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;

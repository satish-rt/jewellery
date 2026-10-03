import React, { Suspense, lazy, Component } from "react";

// Lazy load Spline to prevent it from blocking the main thread
const Spline = lazy(() => import("@splinetool/react-spline"));

const FallbackUI = () => (
  <div className="w-full h-full bg-gradient-to-br from-charcoal via-gray-900 to-[#2A2318] flex items-center justify-center">
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-dark via-transparent to-transparent"></div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="w-full h-full bg-charcoal flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 animate-pulse bg-gray-900"></div>
    <div className="w-16 h-16 border-t-2 border-gold rounded-full animate-spin"></div>
  </div>
);

class SplineErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return <FallbackUI />;
    return this.props.children;
  }
}

const HeroSpline = () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    return <FallbackUI />;
  }

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <SplineErrorBoundary>
        <Suspense fallback={<LoadingSkeleton />}>
          {/* Replace the scene URL below with your own Spline scene */}
          <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9U/scene.splinecode" />
        </Suspense>
      </SplineErrorBoundary>
    </div>
  );
};

export default HeroSpline;

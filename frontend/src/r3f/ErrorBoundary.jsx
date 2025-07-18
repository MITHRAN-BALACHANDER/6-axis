import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('3D Scene Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-700 bg-slate-50 rounded-2xl p-8 text-center m-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Something broke in the 3D scene 🧨</h2>
          <p>Please check the console for more details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

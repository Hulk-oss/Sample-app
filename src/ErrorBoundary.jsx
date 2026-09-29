import React from "react";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false, message: "" };

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "Unexpected application error" };
  }

  componentDidCatch(error) {
    console.error("Freelancer CFO UI error", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="auth-shell">
        <div className="auth-card">
          <div className="brand">Freelancer CFO</div>
          <div className="auth-title">
            <p className="eyebrow">Recovery</p>
            <h1>Something went wrong</h1>
            <p>The app hit an unexpected UI error. Reload the page to restore the workspace.</p>
          </div>
          <button className="button primary" type="button" onClick={() => window.location.reload()}>
            Reload workspace
          </button>
        </div>
      </div>
    );
  }
}

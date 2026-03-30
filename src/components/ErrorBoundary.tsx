"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            className="rounded-lg bg-surface-dark border border-border-dark p-6 text-center"
            role="alert"
          >
            <p className="text-sm text-gray-400">
              Something went wrong rendering this section.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-3 px-3 py-1 text-xs rounded bg-border-dark hover:bg-border-hover text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-purple"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

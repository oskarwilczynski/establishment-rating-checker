import React from 'react';

import styled from 'styled-components';

import Typography from '@material-ui/core/Typography';

const ErrorHeader = styled(Typography)`
  && {
    color: #982520;
  }
`

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
      <ErrorHeader align='center' variant="display2">
        Oops! Something went wrong!
      </ErrorHeader>
      )
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
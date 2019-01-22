import React, { Component } from 'react';

import RegionsList from './RegionsList';
import AuthoritiesList from './AuthoritiesList';
import ResultsTable from './ResultsTable';
import ScotishResultsTable from './ScotishResultsTable';
import ErrorBoundary from './ErrorBoundary';

import styled from 'styled-components';

import { injectGlobal } from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

injectGlobal`
  body {
    background: #4aba91;
    padding: 1vw;
  }
`

const StyledCard = styled(Card)`
  && {
    max-width: 750px;
    margin: 0 auto;
  }
`

class App extends Component {
  constructor(props) {
    super(props);
    this.decideTable = this.decideTable.bind(this);

    this.state = {
      selectedRegion: "",
      selectedAuthorityId: ""
    }
  }

  getRegion = (e) => {
    this.setState({selectedRegion: e.target.value});
  }

  getAuthorityId = (e) => {
    this.setState({selectedAuthorityId: e.target.value});
  }

  // Render table for Scotland's results or regular
  decideTable = () => {
    if (this.state.selectedRegion === "Scotland") {
      return (
        <ScotishResultsTable 
          selectedAuthorityId = {this.state.selectedAuthorityId}
        />)
    } else {
      return (
        <ResultsTable 
          selectedAuthorityId = {this.state.selectedAuthorityId}
        />)
    }
  }

  render() {
    return (
      <div>
        <Typography align='center' variant="display3" gutterBottom>
          Establishment Rating Checker
        </Typography>
        <StyledCard>
          <CardContent>
            <ErrorBoundary>
              <RegionsList
                getRegion = {this.getRegion}
              />
              <AuthoritiesList
                selectedRegion = {this.state.selectedRegion}
                getAuthorityId = {this.getAuthorityId}
              />
              {this.decideTable()}
            </ErrorBoundary>
          </CardContent>
        </StyledCard>
      </div>
    );
  }
}

export default App;

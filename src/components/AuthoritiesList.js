import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const StyledFormControl = styled(FormControl)`
  && {
    display: flex;
    max-width: 300px;
    margin-bottom: 2vw;
  }
`

class AuthoritiesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allAuthorities: [],
      currentAuthorities: [],
      isLoaded: false
    }
  }

  componentDidMount() {
    fetch('http://api.ratings.food.gov.uk/Authorities', {
      headers: {
        "x-api-version" : 2,
      },
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw Error(`Request rejected with status ${res.status}`);
        }
      })
      .then(data => this.setState({
        allAuthorities: data.authorities,
        isLoaded: true
      }))
      .catch(console.error);
  }

  // Filter through all authorities to display only these within selected region
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedRegion !== this.props.selectedRegion) {
        const currentAuthorities = this.state.allAuthorities.filter(authority => authority.RegionName === nextProps.selectedRegion);

        this.setState({currentAuthorities});
    }
  }
  
  render() {
    return (
      <StyledFormControl>
        <InputLabel htmlFor="regions-list">
          {this.state.isLoaded ? "Select your authority" : "Loading..."}
        </InputLabel>
        <Select
          native
          onChange={this.props.getAuthorityId}
          inputProps={{
            name: 'authorities-list',
            id: 'authorities-list',
          }}
        >
          <option></option>
          {
            Object
              .keys(this.state.currentAuthorities)
              .map(key => 
                <option key={key} value={this.state.currentAuthorities[key].LocalAuthorityId}>
                  {this.state.currentAuthorities[key].Name}
                </option>
              )
          }
        </Select>
      </StyledFormControl>
    );
  }
}

AuthoritiesList.propTypes = {
  getAuthorityId: PropTypes.func.isRequired,
  selectedRegion: PropTypes.string.isRequired
};

export default AuthoritiesList;
import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

const StyledFormControl = styled(FormControl)`
  && {
    display: flex;
    max-width: 300px;
    margin-bottom: 1vw;
  }
`

class RegionsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      regionsList: [],
      isLoaded: false
    }
  }

  componentDidMount() {
    fetch('http://api.ratings.food.gov.uk/Regions', {
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
        regionsList: data.regions,
        isLoaded: true
      }))
      .catch(err => console.error(err));
  }

  render() {
    return (
      <StyledFormControl>
        <InputLabel htmlFor="regions-list">
          {this.state.isLoaded ? "Select your region or country" : "Loading..."}
        </InputLabel>
        <NativeSelect
          onChange={this.props.getRegion}
          inputProps={{
            name: 'regions-list',
            id: 'regions-list',
          }}
        >
          <option></option>
          {
            Object
              .keys(this.state.regionsList)
              .map(key => 
                <option key={key} value={this.state.regionsList[key].name}>{this.state.regionsList[key].name}</option>
              )
          }
        </NativeSelect>
      </StyledFormControl>
    );
  }
}

RegionsList.propTypes = {
  getRegion: PropTypes.func.isRequired
};

export default RegionsList;
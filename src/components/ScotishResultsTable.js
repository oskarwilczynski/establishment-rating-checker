import React from 'react';
import PropTypes from 'prop-types';

import { LoadingOverlay, Loader } from 'react-overlay-loader';
import 'react-overlay-loader/styles.css';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class ScotishResultsTable extends React.Component {
  constructor(props) {
    super(props);
    this.setResults = this.setResults.bind(this);
    this.calcRating = this.calcRating.bind(this);

    this.state = {
      results: {},
      isLoading: false
    }
  }

  setResults = (ests) => {
    const newResults = {
      totalNumber: ests.length,
      passAndSafe: 0,
      pass: 0,
      improvementRequired: 0,
      awaitingPublication: 0,
      exempt: 0,
      awaitingInspection: 0
    }

    for (let i = 0; i < ests.length; i++) {
      switch(ests[i].RatingValue) {
        case "Pass and Eat Safe":
          newResults.passAndSafe++
          break;
        case "Pass":
          newResults.pass++
          break;
        case "Improvement Required":
          newResults.improvementRequired++
          break;
        case "Awaiting Publication":
          newResults.awaitingPublication++
          break;
        case "Exempt":
          newResults.exempt++
          break;
        case "Awaiting Inspection":
          newResults.awaitingInspection++
          break;
        default:
          console.error("Unmatched rating: " + ests[i].RatingValue);
      }
    }

    this.setState({
      results: newResults,
      isLoading: false
    })
  }

  calcRating = (rating) => {
    if (!rating && rating !== 0) {
      return "";
    } else if (rating === 0) {
      return "0%";
    } else {
      return Math.round(rating * 100 / this.state.results.totalNumber) + "%";
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedAuthorityId !== this.props.selectedAuthorityId) {
      this.setState({isLoading: true});

      fetch(`http://api.ratings.food.gov.uk/Establishments?pageNumber=1&pageSize=5000&localAuthorityId=${nextProps.selectedAuthorityId}`, {
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
        .then(data => this.setResults(data.establishments)) // Passes data to setResults to populate state
        .catch(console.error);
    }
  }

  render() {
    return (
      <Paper>
        <LoadingOverlay>
          <Loader loading={this.state.isLoading}/>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rating</TableCell>
                <TableCell>Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Pass and Eat Safe</TableCell>
                <TableCell>{this.calcRating(this.state.results.passAndSafe)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Pass</TableCell>
                <TableCell>{this.calcRating(this.state.results.pass)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Improvement Required</TableCell>
                <TableCell>{this.calcRating(this.state.results.improvementRequired)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Exempt</TableCell>
                <TableCell>{this.calcRating(this.state.results.exempt)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Awaiting Inspection</TableCell>
                <TableCell>{this.calcRating(this.state.results.awaitingInspection)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Awaiting Publication</TableCell>
                <TableCell>{this.calcRating(this.state.results.awaitingPublication)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </LoadingOverlay>
      </Paper>
    );
  }
}

ScotishResultsTable.propTypes = {
  selectedAuthorityId: PropTypes.string.isRequired
};

export default ScotishResultsTable;
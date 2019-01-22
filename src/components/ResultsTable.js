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

class ResultsTable extends React.Component {
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
      fiveStar: 0,
      fourStar: 0,
      threeStar: 0,
      twoStar: 0,
      oneStar: 0,
      zeroStar: 0,
      exempt: 0,
      awaitingInspection: 0
    }

    for (let i = 0; i < ests.length; i++) {
      switch(ests[i].RatingValue) {
        case "5":
          newResults.fiveStar++
          break;
        case "4":
          newResults.fourStar++
          break;
        case "3":
          newResults.threeStar++
          break;
        case "2":
          newResults.twoStar++
          break;
        case "1":
          newResults.oneStar++
          break;
        case "0":
          newResults.zeroStar++
          break;
        case "Exempt":
          newResults.exempt++
          break;
        case "AwaitingInspection":
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
                <TableCell>5-star</TableCell>
                <TableCell>{this.calcRating(this.state.results.fiveStar)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>4-star</TableCell>
                <TableCell>{this.calcRating(this.state.results.fourStar)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>3-star</TableCell>
                <TableCell>{this.calcRating(this.state.results.threeStar)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2-star</TableCell>
                <TableCell>{this.calcRating(this.state.results.twoStar)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>1-star</TableCell>
                <TableCell>{this.calcRating(this.state.results.oneStar)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>0-star</TableCell>
                <TableCell>{this.calcRating(this.state.results.zeroStar)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Exempt</TableCell>
                <TableCell>{this.calcRating(this.state.results.exempt)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Awaiting Inspection</TableCell>
                <TableCell>{this.calcRating(this.state.results.awaitingInspection)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          </LoadingOverlay>
      </Paper>
    );
  }
}

ResultsTable.propTypes = {
  selectedAuthorityId: PropTypes.string.isRequired
};

export default ResultsTable;
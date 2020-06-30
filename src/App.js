import React, { Component } from "react";
import "./App.css";
import "whatwg-fetch";
import SearchBox from './components/search';
import Card from './components/card';

console.log(window);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { moveID: 157336 };
  }

  // the api request function
  fetchApi = (url) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // update state with API data
        this.setState({
          movieID: data.id,
          original_title: data.original_title,
          tagline: data.tagline,
          overview: data.overview,
          homepage: data.homepage,
          poster: data.poster_path,
          production: data.production_companies,
          production_countries: data.production_countries,
          genre: data.genres,
          release: data.release_date,
          vote: data.vote_average,
          runtime: data.runtime,
          revenue: data.revenue,
          backdrop: data.backdrop_path,
        });
      });
  };

  render() {
    return (
      <div>
        <SearchBox fetchMovieID={this.fetchMovieID} />
        <Card data={this.state} />
      </div>
    );
  }

  fetchMovieID = (movieID) => {
    const url = `https://api.themoviedb.org/3/movie/${movieID}?&api_key=cfe422613b250f702980a3bbf9e90716`;
    this.fetchApi(url);
  };


  componentDidMount() {
    this.fetchMovieID(this.state.movieID);
    const suggests = new Bloodhound({
      datumTokenizer: datum => Bloodhound.tokenizers.whitespace(datum.value),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url: 'https://api.themoviedb.org/3/search/movie?query=%QUERY&api_key=cfe422613b250f702980a3bbf9e90716',
        filter: function(movies) {
          // Map the remote source JSON array to a JavaScript object array
          return $.map(movies.results, function(movie) {
            return {
              value: movie.original_title, // search original title
              id: movie.id // get ID of movie simultaniously
            };
          });
        } // end filter
      } // end remote
    }); // end new Bloodhound
    suggests.initialize(); // initialise bloodhound suggestion engine

    //========================= END BLOODHOUND ==============================//

    //========================= TYPEAHEAD ==============================//
    // Instantiate the Typeahead UI
    $('.typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 2
    }, {source: suggests.ttAdapter()}).on('typeahead:selected', function(obj, datum) {
      this.fetchMovieID(datum.id)
    }.bind(this)); // END Instantiate the Typeahead UI
    //========================= END TYPEAHEAD ==============================//

  }
}

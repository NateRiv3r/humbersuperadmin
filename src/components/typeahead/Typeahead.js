import Autosuggest from "react-autosuggest";
import React from "react";

export class Typeahead extends React.Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: "",
      suggestions: [],
      n: null
    };
    // Imagine you have a list of languages that you'd like to autosuggest.
  }

  // Teach Autosuggest how to calculate suggestions for any given input value.
  getSuggestions = () => this.state.n || this.props.data;

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  getSuggestionValue = suggestion => {
    return suggestion && suggestion.title;
  };

  static getDerivedStateFromProps(props, state) {
    if (props.data !== state.n) {
      return { n: props.data };
    } else {
      return null;
    }
  }

  // Use your imagination to render suggestions.
  renderSuggestion = suggestion => <div>{suggestion.title}</div>;

  onChange = (event, { newValue }) => {
    this.setState(
      {
        value: newValue
      },
      () =>
        this.props.onChange(
          event,
          newValue,
          this.state.n || this.state.suggestions
        )
    );
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions, n } = this.state;
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: this.props.placeholder,
      value,
      onChange: this.onChange,
      required: this.props.required
    };

    // Finally, render it!
    return (
      <Autosuggest
        suggestions={n || suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

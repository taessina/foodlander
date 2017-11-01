// @flow
import React from 'react';
import { connect } from 'react-redux';
import Config from 'react-native-config';
import querystring from 'query-string';
import SearchInput from './presenter';
import { actionCreators as placeActionCreators } from '../../redux/modules/place';

const AUTOCOMPLETE_API = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?';
const query = {
  key: Config.GOOGLE_MAPS_API_KEY,
  types: 'geocode',
};

type Props = {
  onBack: Function,
  getPlacesNearArea: Function,
};

type State = {
  text: string,
  prevText: string,
  suggestions: Array<any>,
};

class SearchInputContainer extends React.Component<Props, State> {
  state = { text: '', prevText: '', suggestions: [] };

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  timer: number;

  fetchSuggestions = () => {
    const input = this.state.text;
    const params = { ...query, input };
    fetch(`${AUTOCOMPLETE_API}${querystring.stringify(params)}`)
      .then(response => response.json())
      .then((data) => {
        if (data.status === 'OK') {
          this.setState({ suggestions: data.predictions, prevText: input });
          this.startTimer();
        } else if (data.status === 'ZERO_RESULTS') {
          this.setState({
            suggestions: [{
              place_id: 'EMPTY',
              description: 'Cannot find any results',
            }],
            prevText: input,
          });
          this.startTimer();
        } else {
          throw data.status;
        }
      })
      .catch(() => {
        // Retry 5s later, inhibiting errors
        setTimeout(
          this.fetchSuggestions,
          5000,
        );
      });
  }

  startTimer() {
    const { text, prevText } = this.state;
    this.timer = setTimeout(() => {
      if (text.length > 1 && text !== prevText) {
        this.fetchSuggestions();
      } else if (text.length <= 1) {
        this.setState({ suggestions: [], prevText: text });
        this.startTimer();
      } else {
        this.startTimer();
      }
    }, 1500);
  }

  handleChangeText = (text: string) => {
    this.setState({ text });
  }

  handleOnPress = (keywords: Array<string>) => {
    this.props.getPlacesNearArea(keywords);
    this.props.onBack();
  }

  render() {
    return (
      <SearchInput
        onBack={this.props.onBack}
        onChangeText={this.handleChangeText}
        suggestions={this.state.suggestions}
        onPress={this.handleOnPress}
      />
    );
  }
}

const mapDispatchToProps = {
  getPlacesNearArea: placeActionCreators.doGetPlacesNearArea,
};

export default connect(null, mapDispatchToProps)(SearchInputContainer);

// @flow
import React from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  Linking,
  Text,
  View,
} from 'react-native';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchInput from '../../components/SearchInput';
import SearchBar from '../../components/SearchBar';
import Touchable from '../../components/F8Touchable';
import AnimatedLogo from '../../components/AnimatedLogo';
import FloatingActionButton from '../../components/FloatingActionButton';
import colors from '../../themes/color';
import styles from './style';
import AnimatedBackgound from './AnimatedBackground';
import Splashscreen from '../Splashscreen';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

type Props = {
  getNextPlace: Function,
  getNearbyPlaces: Function,
  resetArea: Function,
  latitude: number,
  longitude: number,
  delta: number,
  places: Array<any>,
  index: number,
  isAreaSearch: boolean,
  locationLocked: boolean,
};

type State = { search: boolean };

export default class Home extends React.Component<Props, State> {
  state = { search: false };

  componentDidMount() {
    const {
      latitude, longitude, locationLocked,
    } = this.props;

    const latitudeDelta = 0.005; // Approx. viewport of 500m horizontally
    const longitudeDelta = latitudeDelta * ASPECT_RATIO;

    if (locationLocked) {
      // HACK: Shamefully map doesn't load instantly, thus ugly hack
      this.mapLoadTimer = setTimeout(() => {
        this.map.animateToRegion({
          latitude, longitude, latitudeDelta, longitudeDelta,
        });
        this.props.getNearbyPlaces({ latitude, longitude });
      }, 10000);
    }

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentDidUpdate(prevProps: Props) {
    const {
      latitude, longitude, delta, places, index,
    } = this.props;

    const latitudeDelta = delta; // Approx. viewport of 500m horizontally
    const longitudeDelta = latitudeDelta * ASPECT_RATIO;

    if (!prevProps.locationLocked && this.props.locationLocked) {
      if (this.map) {
        this.map.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005 * ASPECT_RATIO,
        });
      }
      this.props.getNearbyPlaces({ latitude, longitude });
    } else if (prevProps.latitude !== latitude || prevProps.longitude !== longitude) {
      this.props.getNearbyPlaces({ latitude, longitude });
      if (this.map) {
        this.map.animateToRegion({
          latitude,
          longitude,
          latitudeDelta,
          longitudeDelta,
        });
      }
    } else if (prevProps.index !== index) {
      const place = places[index];
      if (place && this.map) {
        this.map.animateToRegion({
          latitude: place.latitude,
          longitude: place.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005 * ASPECT_RATIO,
        });
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.mapLoadTimer);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  map: MapView;
  mapLoadTimer: number;

  handleBackButton = () => {
    if (this.state.search) {
      this.setState({ search: false });
      return true;
    }

    if (this.props.isAreaSearch) {
      this.props.resetArea();
      return true;
    }

    return false;
  }

  handleNavigate() {
    const { places, index } = this.props;
    const { latitude, longitude, name } = places[index];
    const url = `geo:0,0?q=${latitude},${longitude}(${name})`;
    Linking.openURL(url).catch((err) => {
      Alert.alert(
        'An error occurred',
        err,
        [{ text: 'OK' }],
      );
    });
  }

  renderRating(rating: number) {
    if (rating) {
      const stars = [];
      for (let i = 0; i < 5; i += 1) {
        stars.push((
          <Icon
            name={Math.round(rating) > i ? 'star' : 'star-border'}
            size={24}
            color={colors.ratingColor}
            key={i}
          />
        ));
      }
      return (
        <View style={styles.rating}>
          {stars}
        </View>
      );
    }

    return null;
  }

  renderSelectedPlace() {
    const { places, index } = this.props;
    const place = places[index];

    if (!this.props.locationLocked || !places.length) {
      return null;
    }

    if (place) {
      return (
        <View style={styles.textContainer}>
          <Text style={styles.text}>{place.name}</Text>
          <Text
            numberOfLines={1}
            style={styles.subtext}
          >
            {place.vicinity}
          </Text>
          {this.renderRating(place.rating)}
          <View style={styles.separator} />
          <Touchable
            onPress={() => this.handleNavigate()}
          >
            <View style={styles.navContainer}>
              <Text style={styles.navText}>GET DIRECTIONS</Text>
            </View>
          </Touchable>
        </View>
      );
    }
    return (
      <View style={[styles.textContainer, styles.textContainerWithoutAction]}>
        <Text style={styles.text}>Foodlander</Text>
        <Text style={styles.subtext}>
          Tap the button below to discover your next favourite food place.
        </Text>
      </View>
    );
  }

  renderMarkers() {
    const { places, index } = this.props;
    return places.map((place, i) => {
      const { latitude, longitude, place_id: id } = place;
      const color = index === i ? colors.selectedPinColor : colors.accentColor;
      return (
        <MapView.Marker
          coordinate={{ latitude, longitude }}
          identifier={id}
          pinColor={color}
          title={place.name}
          key={id}
        />
      );
    });
  }

  renderFAB() {
    if (this.props.places.length) {
      return (
        <FloatingActionButton
          position="center"
          onPress={this.props.getNextPlace}
          buttonColor={colors.accentColor}
        >
          <Icon name="local-dining" size={24} color="#fff" />
        </FloatingActionButton>
      );
    }
    return null;
  }

  renderSearchInput() {
    if (!this.state.search) return null;
    return (
      <SearchInput
        onBack={() => this.setState({ search: false })}
      />
    );
  }

  renderLoading() {
    if (!this.props.locationLocked || !this.props.places.length) {
      return (
        <View style={styles.loading}>
          <AnimatedLogo size={64} />
        </View>
      );
    }

    return null;
  }

  renderComponents() {
    if (this.state.search) {
      return (
        <View style={{ flex: 1 }}>
          <AnimatedBackgound />
          {this.renderSearchInput()}
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        {<SearchBar onPress={() => this.setState({ search: true })} />}
        {this.renderSelectedPlace()}
        {this.renderFAB()}
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Splashscreen />
        <MapView
          ref={(c) => { this.map = c; }}
          showsUserLocation
          followsUserLocation
          showsMyLocationButton={false}
          initialRegion={{
            latitude: 10,
            longitude: 110,
            latitudeDelta: 50,
            longitudeDelta: 50 * ASPECT_RATIO,
          }}
          style={styles.map}
        >
          {this.renderMarkers()}
        </MapView>
        {this.renderLoading()}
        {this.renderComponents()}
      </View>
    );
  }
}

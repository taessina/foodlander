// @flow
import React from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  Linking,
  Text,
  View,
  ToastAndroid,
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
import Restaurant from './Restaurant';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

type Props = {
  getNextPlace: Function,
  getExtendedPlace: Function,
  getNearbyPlaces: Function,
  resetArea: Function,
  doMarkerSelected: Function,
  doUpdateIndex: Function,
  latitude: number,
  longitude: number,
  delta: number,
  places: Array<any>,
  extPlaces: Array<any>,
  index: number,
  isAreaSearch: boolean,
  locationLocked: boolean,
  modal: boolean,
  favouriteList: String[],
};

type State = {
  search: boolean,
  currentPlace: string,
  favouritePlaces: Object[],
  favouriteIndex: number[],
  maxIndex: number,
  renderFAB3: boolean,
  extendedIndex: number,
};

export default class Home extends React.Component<Props, State> {
  state = {
    search: false,
    currentPlace: '',
    favouritePlaces: [],
    favouriteIndex: [],
    maxIndex: 10,
    renderFAB3: false,
    extendedIndex: -10,
  };

  componentWillMount() {
    const { places, index } = this.props;
    // addOnFunction2
    if (this.props.index !== null) {
      const place = places[index];
      const { id } = place;
      if (place && this.map) {
        this.setState({
          currentPlace: id,
        });
      }
    }
  }

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
    if ((prevProps.modal) && (!this.props.modal)) {
      if (this.map) {
        this.map.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005 * ASPECT_RATIO,
        });
      }
    }
    if (prevProps.places !== this.props.places) {
      this.loadFavouriteList();
    }
    if (prevProps.favouriteList !== this.props.favouriteList) {
      if (this.props.places.length > 0) {
        this.loadFavouriteList();
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.mapLoadTimer);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  getNextPlace() {
    if (this.props.extPlaces.length > 0) {
      // the ratio to jumped into extended places than old places is 3 : 1
      let randInt = 0;
      randInt = Math.floor(Math.random() * (4));
      switch (randInt) {
        case 0:
        case 1:
        case 2:
          this.getNextExtended();
          break;
        case 3:
          this.props.getNextPlace();
          // reset extendedIndex to null
          this.setState({
            extendedIndex: -10,
          });
          break;
        default:
          break;
      }
    } else if (this.props.index < this.state.maxIndex) {
      this.props.getNextPlace();
    } else {
      // increase area
      ToastAndroid.show('Try Somewhere Further', ToastAndroid.LONG);
      this.setState({
        maxIndex: this.state.maxIndex + 10,
        renderFAB3: true,
      });
      this.props.getNextPlace();
    }
  }

  getNextFavourite() {
    const place = this.getFavouritePlace();
    if ((place !== null) && (this.map)) {
      this.map.animateToRegion({
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005 * ASPECT_RATIO,
      });
    }
  }

  // randomly retrieve favouritePlace
  getFavouritePlace() {
    const { index } = this.props;
    let favouritePlace = null;
    if (this.props.favouriteList.length > 0) {
      if (this.state.favouritePlaces.length > 0) {
        const max = this.state.favouritePlaces.length;
        let randIndex = index;
        let loop = true;
        if (this.state.favouritePlaces.length > 1) {
          while (loop) {
            randIndex = Math.floor(Math.random() * (max));
            if (this.state.favouriteIndex[randIndex] !== index) {
              loop = false;
            }
          }
        } else {
          randIndex = 0;
        }
        favouritePlace = this.state.favouritePlaces[randIndex];
        this.props.doUpdateIndex(this.state.favouriteIndex[randIndex]);
      } else {
        ToastAndroid.show('No Favourite Item Nearby', ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show('No Item In Favourite List', ToastAndroid.SHORT);
    }
    return favouritePlace;
  }

  getNextExtended() {
    const place = this.getExtendedPlace();
    if ((place !== null) && (this.map)) {
      this.map.animateToRegion({
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005 * ASPECT_RATIO,
      });
    }
  }

  // randomly retrieve extendedPlace
  getExtendedPlace() {
    const index = this.state.extendedIndex;
    const max = this.props.extPlaces.length;
    let randIndex = index;
    let loop = true;
    if (this.props.extPlaces.length > 1) {
      while (loop) {
        randIndex = Math.floor(Math.random() * (max));
        if (randIndex !== index) {
          loop = false;
        }
      }
    } else {
      randIndex = 0;
    }
    this.setState({
      extendedIndex: randIndex,
    });
    return this.props.extPlaces[randIndex];
  }

  escalate() {
    const { places, latitude, longitude } = this.props;
    const place = places[this.props.index];

    this.props.getExtendedPlace({ latitude, longitude });

    if (place && this.map) {
      this.map.animateToRegion({
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01 * ASPECT_RATIO,
      });
    }
    this.state.renderFAB3 = false;

    // reload favourite list based on extended places
    this.loadFavouriteList();
  }

  map: MapView;
  mapLoadTimer: number;

  markerSelected(id: string, lat: number, lng: number) {
    this.props.doMarkerSelected(id);
    this.map.animateToRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.0005,
      longitudeDelta: 0.0005 * ASPECT_RATIO,
    });
    this.updateState(id);
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

  // load favourite list that matches nearby
  loadFavouriteList() {
    const favouriteList = [];
    const index = [];
    if (this.props.places.length > 0) {
      if (this.props.favouriteList.length > 0) {
        for (let i = 0; i < this.props.places.length; i += 1) {
          for (let u = 0; u < this.props.favouriteList.length; u += 1) {
            const place = this.props.places[i];
            const favourite = this.props.favouriteList[u];
            if (place.place_id === favourite) {
              favouriteList.push(place);
              index.push(i);
            }
          }
        }
      }
    }
    if (this.props.extPlaces.length > 0) {
      if (this.props.favouriteList.length > 0) {
        for (let i = 0; i < this.props.places.length; i += 1) {
          for (let u = 0; u < this.props.favouriteList.length; u += 1) {
            const place = this.props.places[i];
            const favourite = this.props.favouriteList[u];
            if (place.place_id === favourite) {
              favouriteList.push(place);
              index.push(i);
            }
          }
        }
      }
    }
    this.setState({
      favouritePlaces: favouriteList,
      favouriteIndex: index,
    });
  }


  updateState(placeId: string) {
    this.setState({
      currentPlace: placeId,
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
          onPress={() => this.markerSelected(id, latitude, longitude)}
        />
      );
    });
  }

  // extendedMarkers
  renderExtMarkers() {
    const { extPlaces } = this.props;
    const extIndex = this.state.extendedIndex;

    return extPlaces.map((place, i) => {
      const { latitude, longitude, place_id: id } = place;
      let color;
      if (extIndex !== null) {
        color = extIndex === i ? colors.selectedPinColor : colors.accentColor;
      } else {
        color = colors.accentColor;
      }
      return (
        <MapView.Marker
          coordinate={{ latitude, longitude }}
          identifier={id}
          pinColor={color}
          title={place.name}
          key={id}
          onPress={() => this.markerSelected(id, latitude, longitude)}
        />
      );
    });
  }

  renderFAB() {
    if (this.props.places.length) {
      return (
        <FloatingActionButton
          position="left"
          onPress={() => this.getNextPlace()}
          buttonColor={colors.accentColor}
        >
          <Icon name="local-dining" size={24} color="#fff" />
        </FloatingActionButton>
      );
    }
    return null;
  }

  renderFAB2() {
    if (this.props.places.length) {
      return (
        <FloatingActionButton
          position="right"
          onPress={() => this.getNextFavourite()}
          buttonColor={colors.accentColor2}
        >
          <Icon name="local-dining" size={24} color="#FFF" />
        </FloatingActionButton>
      );
    }
    return null;
  }

  renderFAB3() {
    if (this.props.places.length) {
      return (
        <FloatingActionButton
          position="center"
          onPress={() => this.escalate()}
          buttonColor={colors.accentColor3}
        >
          <Icon name="open-with" size={24} color="#FFF" />
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
        {this.renderFAB2()}
        {this.state.renderFAB3 ? this.renderFAB3() : null}
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Splashscreen />
        <Restaurant placeId={this.state.currentPlace} />
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
          {this.state.extendedIndex === -10 ? this.renderMarkers() : this.renderExtMarkers()}
        </MapView>
        {this.renderLoading()}
        {this.renderComponents()}
      </View>
    );
  }
}

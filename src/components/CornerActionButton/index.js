// @flow
import * as React from 'react';
import {
  View,
  Image,
} from 'react-native';
import Touchable from '../F8Touchable';
import styles from './styles';
import openMenuIcon from '../../images/openMenuIcon.png';
import returnIcon from '../../images/returnIcon.png';
import expandIcon from '../../images/expandIcon.png';
import contractIcon from '../../images/contractIcon.png';

type Props = {
  onPress: Function,
  position: 'center' | 'left' | 'right',
  mode: string,
};

type State = {
  iconSource: any,
}

export default class FloatingActionButton extends React.Component<Props, State> {
  static defaultProps = {
    position: 'center',
    mode: 'default',
    key: null,
  };

  state = {
    iconSource: openMenuIcon,
  }

  componentWillMount() {
    this.getSource();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.mode !== this.props.mode) {
      this.getSource();
    }
  }

  getSource() {
    let source = null;
    switch (this.props.mode) {
      case 'default':
        source = openMenuIcon;
        break;
      case 'fav':
        source = returnIcon;
        break;
      case 'expand':
        source = expandIcon;
        break;
      case 'contract':
        source = contractIcon;
        break;
      default:
    }
    this.setState({
      iconSource: source,
    });
  }

  render() {
    return (
      <View style={[styles.container, styles[this.props.position]]}>
        <Touchable
          onPress={() => this.props.onPress()}
        >
          <Image
            source={this.state.iconSource}
            style={{ width: 70, height: 70 }}
          />
        </Touchable>
      </View>
    );
  }
}

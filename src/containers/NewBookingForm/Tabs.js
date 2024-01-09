import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tab from './Tab';

// Styled Components Import
import {
  BookingFormsDiv,
  BookingNav,
  BookingParent,
  MobileBookingNav,
} from './wrapper/NewBookingFormStyle';

export class Tabs extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeTab: this.props.children[0].props.label,
      showMenu: false,
    };
  }

  onClickTabItem = tab => {
    this.setState({ activeTab: tab });
  };

  menuBtnClick = () => {
    (this.state.showMenu) ? this.setState({showMenu: false}) : this.setState({showMenu: true});
  };

  mobileTabSelect = tab => {
    this.setState({ activeTab: tab });
    (this.state.showMenu) ? this.setState({showMenu: false}) : this.setState({showMenu: true});
  }

  render() {
    const {
      onClickTabItem,
      menuBtnClick,
      mobileTabSelect,
      props: { children },
      state: { activeTab, showMenu },
    } = this;

    return (
      <BookingParent>
      {/* // <div className="col-md-6"> */}
        {/* Above 800px (PC View) Booking NavBar */}
        <BookingNav>
          <ul>
            {children.map(child => {
              const { label } = child.props;
              return (
                <Tab
                  activeTab={activeTab}
                  key={label}
                  label={label}
                  onClick={onClickTabItem}
                />
              );
            })}
          </ul>
        </BookingNav>

        {/* Below 800px (Mobile View) Booking NavBar */}
        {
          (showMenu) &&
            <MobileBookingNav>
              <ul className='position-relative'>
                <li className="tab-list-item position-absolute w-100 close-btn mt-3 pr-4">
                  <p onClick={menuBtnClick}><i className="fas fa-times"/></p>
                </li>
                {children.map(child => {
                  const { label } = child.props;
                  return (
                    <Tab
                      activeTab={activeTab}
                      key={label}
                      label={label}
                      onClick={mobileTabSelect}
                    />
                  );
                })}
              </ul>
            </MobileBookingNav>
        }
        

        {children.map((child, index) => {
          if (child.props.label !== activeTab) return undefined;
          return (
            <BookingFormsDiv key={index}>
              <div className="mobile-form-nav justify-content-between " style={{backgroundColor: '#378EDD'}}>
                <p>{(child.props.label === activeTab) ? activeTab : ''}</p>
                <p className="dropdown" onClick={menuBtnClick}>
                  <i className="fas fa-chevron-circle-down" />
                </p>
              </div>
              
              {child.props.children}
            </BookingFormsDiv>
          );
        })}
        {/* </div> */}
      </BookingParent>
    );
  }
}
export default Tabs;

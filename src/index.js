/**
 *
 *
 */

import React, {PropTypes} from 'react'
import "babel-polyfill";


export function mask(value, precision, decimalSeparator, thousandSeparator){
    // provide some default values and arg validation.
    if (decimalSeparator === undefined){decimalSeparator = ".";} // default to '.' as decimal separator
    if (thousandSeparator === undefined){thousandSeparator = ",";} // default to ',' as thousand separator
    if (precision === undefined){precision = 2;} // by default, 2 decimal places
    if (precision < 0) {precision = 0;} // precision cannot be negative.
    if (precision > 20) {precision = 20;} // precision cannot greater than 20

    // extract digits. if no digits, fill in a zero.
    let digits = value.match(/\d/g) || ['0'];

    // zero-pad a input
    while (digits.length <= precision) {digits.unshift('0')}

    if (precision > 0){
        // add the decimal separator
        digits.splice(digits.length - precision, 0, ".");
    }

    // clean up extraneous digits like leading zeros.
    digits = Number(digits.join('')).toFixed(precision).split('');


    let decimalpos = digits.length - precision - 1;  // -1 needed to position the decimal separator before the digits.
    if (precision > 0) {
        // set the final decimal separator
        digits[decimalpos] = decimalSeparator;
    }else{
        // when precision is 0, there is no decimal separator.
        decimalpos = digits.length
    }

    // add in any thousand separators
    for (let x=decimalpos - 3; x > 0; x = x - 3){
        digits.splice(x, 0, thousandSeparator);
    }

    return digits.join('');
}


const CurrencyInput = React.createClass({


    /**
     * Prop validation.  See:  https://facebook.github.io/react/docs/component-specs.html#proptypes
     */
    propTypes: {
        onChange: PropTypes.func,
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        decimalSeparator: PropTypes.string,
        thousandSeparator: PropTypes.string,
        precision: PropTypes.number
    },


    /**
     * Component lifecycle function.  See:  https://facebook.github.io/react/docs/component-specs.html#getdefaultprops
     *
     * Invoked once and cached when the class is created. Values in the mapping will be set on this.props if that
     * prop is not specified by the parent component
     *
     * @returns {{onChange: onChange, value: string, decimalSeparator: string, thousandSeparator: string, precision: number}}
     */
    getDefaultProps(){
        return {
            onChange: function(maskValue){/*no-op*/},
            value: "0",
            decimalSeparator: ".",
            thousandSeparator: ",",
            precision: 2
        }
    },


    /**
     * Component lifecycle function.  See:  https://facebook.github.io/react/docs/component-specs.html#getinitialstate
     *
     * Invoked once before the component is mounted. The return value will be used as the initial value of this.state
     *
     * @returns {{maskedValue, customProps: *}}
     */
    getInitialState(){
        let customProps = Object.assign({}, this.props);  //polyfilled for environments that do not support it.
        delete customProps.onChange;
        delete customProps.value;
        delete customProps.decimalSeparator;
        delete customProps.thousandSeparator;
        delete customProps.precision;
        return {
            maskedValue: mask(this.props.value, this.props.decimalSeparator, this.props.thousandSeparator, this.props.precision),
            customProps: customProps
        }
    },


    /**
     * Component lifecycle function.  See:  https://facebook.github.io/react/docs/component-specs.html#updating-componentwillreceiveprops
     *
     * Invoked when a component is receiving new props. This method is not called for the initial render.
     *
     * @param nextProps
     */
    componentWillReceiveProps(nextProps){
        let customProps = Object.assign({}, nextProps);  //polyfilled for environments that do not support it.
        delete customProps.onChange;
        delete customProps.value;
        delete customProps.decimalSeparator;
        delete customProps.thousandSeparator;
        delete customProps.precision;
        this.setState({
            maskedValue: mask(nextProps.value, nextProps.decimalSeparator, nextProps.thousandSeparator, nextProps.precision),
            customProps: customProps
        });
    },


    /**
     * Exposes the current masked value.
     *
     * @returns {*}
     */
    getMaskedValue(){
        return this.state.maskedValue;
    },


    /**
     * onChange Event Handler
     * @param event
     */
    handleChange(event){
        event.preventDefault();
        let maskedValue = mask(event.target.value, this.props.decimalSeparator, this.props.thousandSeparator, this.props.precision);
        this.setState({maskedValue: maskedValue});
        this.props.onChange(maskedValue);
    },


    /**
     * Component lifecycle function.  See:  https://facebook.github.io/react/docs/component-specs.html#render
     * @returns {XML}
     */
    render() {
        return (
            <input
                type="text"
                value={this.state.maskedValue}
                onChange={this.handleChange}
                {...this.state.customProps}
            />
        )
    }
});


export default CurrencyInput
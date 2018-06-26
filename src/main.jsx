import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class AutoSuggestInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSuggestion: false,
            suggestions: [],
            value: null
        };
        this.changeValue = this.changeValue.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.closeSuggestions = this.closeSuggestions.bind(this);
    }

    compareWords(wordA, wordB) {
        let result = 0;
        for (let index = 0; index < wordA.length; index++) {
            if (wordA[index].toLowerCase() === wordB[index].toLowerCase()) {
                result += 1;
            }
        }
        return result / wordB.length * 100;
    }

    normalizeData(data) {
        let updatedData = data;
        Object.keys(abbreviations).forEach((key) => {
            updatedData = updatedData.replace(key, abbreviations[key]);
        });
        return updatedData.toLowerCase();
    }

    getSuggestions(searchString) {
        const searchValues = searchString.split(' ').filter((value) => value !== '') || [];
        const { data } = this.props;
        if (searchValues.length > 1) {
            const suggestions = data.filter((item) => {
                const itemData = item.name.toLowerCase();
                const searchStringData = searchString.toLowerCase();
                if (!itemData.startsWith(searchStringData)) {
                    const normalizedItemString = this.normalizeData(itemData);
                    const normalizedSearchString = this.normalizeData(searchStringData);
                    return normalizedItemString.startsWith(normalizedSearchString);
                }
                return true;
            });
            this.setState({
                suggestions,
                showSuggestion: suggestions.length > 0
            });
        } else {
            const searchValue = searchValues[0];
            if (!searchValue) {
                this.setState({
                    suggestions: [],
                    showSuggestion: false
                });
                return;
            }

            const suggestions = data.filter((item) => {
                const itemStrings = item.name.split(' ');
                // Filter values containing only one word and length >= searchValue length
                return itemStrings.length === 1 && itemStrings[0].length >= searchValue.length;
            }).filter((filteredItem) => {
                return (this.compareWords(searchValue, filteredItem.name) >= 80);
            });

            this.setState({
                suggestions,
                showSuggestion: suggestions.length > 0
            });
        }
    }

    changeValue(event) {
        const value = event.currentTarget.value;
        this.getSuggestions(value);
        const currentValue = {
            name: value,
            id: '_new_'
        };
        this.setState({
            value: currentValue
        });
        this.props.onChange && this.props.onChange(this.props.name, currentValue);
    }

    closeSuggestions(e) {
        const { suggestComponent } = this.refs;
        const area = suggestComponent ? ReactDOM.findDOMNode(suggestComponent) : null;
        if (area && !area.contains(e.target)) {
            this.setState({
                showSuggestion: false
            });
        }
        return false;
    }

    onBlur(event) {
        const value = event.currentTarget.value;
        const currentValue = {
            name: value,
            id: '_new_'
        };
        this.props.onBlur && this.props.onBlur(this.props.name, currentValue);
    }

    renderElement() {
        const { data, disabled } = this.props;
        const { value } = this.state;

        return (
            <input
                ref="element"
                className="form-control"
                value={value ? value.name : ''}
                onChange={this.changeValue}
                onBlur= {this.onBlur}
                autoComplete="new"
                disabled={disabled}
            />
        );
    }

    selectSuggestion(item) {
        this.setState({
            suggestions: [],
            showSuggestion: false,
            value: item
        });
        return false;
    }

    renderSuggestions() {
        const { suggestions } = this.state;
        return (
            <div className="-suggestion-container">
                <div className="-suggestions">
                    {suggestions.map((item, index) => {
                        return (
                            <div className="-suggestion-item" key={index} onClick={this.selectSuggestion.bind(this, item)}>{item.name}</div>
                        )
                    })}
                </div>
            </div>
        )
    }

    renderComponent() {
        const element = this.renderElement();
        const { showSuggestion } = this.state;

        return (
            <div ref="suggestComponent">
                {element}
                {showSuggestion ? this.renderSuggestions() : null}
            </div>
        )
    }

    render() {
        const element = this.renderComponent();
        return element;
    }
}

export default AutoSuggestInput;
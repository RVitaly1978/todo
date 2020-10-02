import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';

import './app.css';

export default class App extends Component {
  maxId = 100;
  state = {
    todoData:
      [
        this.createTodoItem('Wake up...'),
      ],
    term: '',
    filter: 'all',
  };

  createTodoItem(label) {
    return {
      label,
      important: false,
      done: false,
      id: this.maxId++,
    };
  }

  deleteItem = (id) => {
    this.setState(({ todoData }) => {
      const filtered = todoData.filter((el) => el.id !== id);

      return {
        todoData: filtered,
      };
    });
  }

  addItem = (text) => {
    const newItem = this.createTodoItem(text);

    this.setState(
      ({ todoData }) => ({ todoData: [...todoData, newItem] })
    );
  }

  toggleProperty(arr, id, propName) {
    return arr.map((el) => {
      return el.id === id
        ? {...el, [propName]: !el[propName] }
        : {...el };
    });
  }

  search(items, term) {
    if (term.length === 0) {
      return items;
    }

    return items.filter((item) => {
      return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;
    });
  }

  filter(items, filter) {
    switch(filter) {
      case 'all':
        return items;
      case 'active':
        return items.filter((item) => !item.done);
      case 'done':
        return items.filter((item) => item.done);
      default:
        return items;
    }
  }

  onToggleDone = (id) => {
    this.setState(
      ({ todoData }) => ({ todoData: this.toggleProperty(todoData, id, 'done') })
    );
  }

  onToggleImportant = (id) => {
    this.setState(
      ({ todoData }) => ({ todoData: this.toggleProperty(todoData, id, 'important') })
    );
  }

  onSearchChange = (term) => {
    this.setState({ term });
  }

  onFilterChange = (filter) => {
    this.setState({ filter });
  }

  render() {
    const { todoData, term, filter } = this.state;

    const visibleItems = this.filter(
      this.search(todoData, term),
      filter,
    );

    const doneCount = todoData.filter((el) => el.done).length;
    const todoCount = todoData.length - doneCount;

    return (
      <div className='todo-app'>
        <AppHeader toDo={todoCount} done={doneCount} />
        <div className='top-panel d-flex'>
          <SearchPanel
            onSearchChange={this.onSearchChange}
          />
          <ItemStatusFilter
            filter={filter}
            onFilterChange={this.onFilterChange}
          />
        </div>
        <TodoList
          todos={visibleItems}
          onDeleted={this.deleteItem}
          onToggleDone={this.onToggleDone}
          onToggleImportant={this.onToggleImportant}
        />
        <ItemAddForm
          onItemAdded={this.addItem}
        />
      </div>
    );
  }
};

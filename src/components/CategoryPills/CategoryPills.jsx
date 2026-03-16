import React from 'react';
import PropTypes from 'prop-types';
import styles from './CategoryPills.module.css';

const CATEGORIES = ['Fashion', 'Electronics', 'Home', 'Beauty', 'Travel', 'Food', 'Health', 'Education'];

function CategoryPills({ activeCategory, onCategoryChange }) {
  const handleClick = (category) => {
    // Toggle off if already active
    onCategoryChange(activeCategory === category ? null : category);
  };

  return (
    <div className={`${styles.scrollContainer} flex gap-3 py-2`} data-testid="category-pills">
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => handleClick(category)}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
            }`}
            data-testid={`category-pill-${category.toLowerCase()}`}
            aria-pressed={isActive}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

CategoryPills.propTypes = {
  activeCategory: PropTypes.string,
  onCategoryChange: PropTypes.func.isRequired,
};

CategoryPills.defaultProps = {
  activeCategory: null,
};

export default CategoryPills;

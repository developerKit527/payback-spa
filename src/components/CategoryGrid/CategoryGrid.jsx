import React from 'react';
import PropTypes from 'prop-types';
import styles from './CategoryGrid.module.css';

function CategoryGrid({ categories, onCategoryClick }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-bold text-slate-900 mb-4">Shop by Category</h3>
      <div className={styles.grid}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={styles.card}
            onClick={() => onCategoryClick(category)}
            aria-label={`Shop ${category.name} — ${category.cashbackRate}% cashback`}
          >
            <div className={styles.iconCircle}>
              {category.icon || '🛍️'}
            </div>
            <span className={styles.categoryName}>{category.name}</span>
            <span className={styles.cashbackChip}>{category.cashbackRate}% CB</span>
          </button>
        ))}
      </div>
    </div>
  );
}

CategoryGrid.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.string,
      cashbackRate: PropTypes.number.isRequired,
      affiliateUrl: PropTypes.string,
    })
  ).isRequired,
  onCategoryClick: PropTypes.func.isRequired,
};

export default CategoryGrid;

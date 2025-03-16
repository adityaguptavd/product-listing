const base_url = 'https://fakestoreapi.com/products';
const limit = 12;

export const fetchProducts = (category, sort) => new Promise((resolve, reject) =>
    fetch(`${base_url}/${category != "all" ? "category/" + category : "" }?limit=${limit}&sort=${sort}`)
    .then(res => res.json())
    .then(data => resolve(data))
    .catch(err => reject(err))
);

export const fetchCategories = () => new Promise((resolve, reject) =>
    fetch(base_url + '/categories')
    .then(res => res.json())
    .then(data => resolve(data))
    .catch(err => reject(err))
);
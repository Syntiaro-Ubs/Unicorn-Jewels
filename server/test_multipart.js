const axios = require('axios');
const FormData = require('form-data');

async function testPost() {
    const form = new FormData();
    form.append('name', 'test multipart');
    form.append('slug', 'test-multipart');
    form.append('price', '10');
    form.append('price_num', '10');
    form.append('description', 'test');
    form.append('category_id', '');
    form.append('collection_id', '');
    form.append('metal', '');
    form.append('tag', '');
    form.append('is_featured', 'false');
    form.append('is_new_arrival', 'false');
    form.append('stock', '0');
    form.append('barcode', '');

    try {
        const response = await axios.post('http://localhost:5000/api/products', form, {
            headers: form.getHeaders()
        });
        console.log('Success:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testPost();

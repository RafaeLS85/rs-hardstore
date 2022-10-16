import axios from 'axios'
import { Product } from "./type";
import Papa from 'papaparse'

export default {
    list: async (): Promise<Product[]> => {
        return axios
        .get('https://docs.google.com/spreadsheets/d/e/2PACX-1vSGV7-bpgNw2wuEvfoQXB7Tf5XI1tzXlHkbw07TXa0v-5BavX3gQu9tsZZmdpLZfZe7-uEop7fytNGn/pub?output=csv', { responseType: 'blob'})
        .then(res => {
            return new Promise<Product[]>((resolve, reject) => {
                Papa.parse(res.data, {
                    header: true,
                    complete: results => {
                        const products = results.data as Product[]
                        return resolve( products.map(product => ({
                            ...product,
                            price: Number(product.price)
                        })))
                    },
                    error: error => reject(error.message),
                })
            })
        })
    }
}
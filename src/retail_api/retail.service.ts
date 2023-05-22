import {Injectable} from '@nestjs/common'
import {Order, OrdersFilter, RetailPagination} from './types'
import axios, {AxiosInstance} from 'axios'
import {serialize} from '../tools'
import {plainToClass} from 'class-transformer'
import {OrdersResponse} from "../graphql"

@Injectable()
export class RetailService {
    private readonly axios: AxiosInstance

    constructor() {
        this.axios = axios.create({
            baseURL: `${process.env.RETAIL_URL}/api/v5`,
            timeout: 10000,
            headers: { 'X-API-KEY': process.env.RETAIL_KEY},
        })

        this.axios.interceptors.request.use((config) => {
            return config
        })
        this.axios.interceptors.response.use(
            (r) => {
                return r
            },
            (r) => {
                return r
            }
        )
    }

    async orders(filter?: OrdersFilter): Promise<OrdersResponse> {
        const params = serialize(filter, '')
        const res = await this.axios.get('/orders?' + params)

        if (!res.data) throw new Error('RETAIL CRM ERROR')

        const orders = plainToClass(Order, res.data.orders as Array<any>)
        const pagination: RetailPagination = res.data.pagination

        return {orders, pagination}
    }

    async findOrder(id: string): Promise<Order | null> {
        const res = await this.axios.get(`/orders/${id}`, {
                params: {site: 'demo-magazin'},
        })

        if (!res.data) throw new Error('RETAIL CRM ERROR')

        const order = plainToClass(Order, res.data.order)
        return order
    }

    // async orderStatuses(): Promise<CrmType[]> {
    // }
    //
    // async productStatuses(): Promise<CrmType[]> {
    // }
    //
    // async deliveryTypes(): Promise<CrmType[]> {
    // }
}

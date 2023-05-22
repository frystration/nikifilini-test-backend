import {Args, Query, Resolver} from '@nestjs/graphql'
import {RetailService} from '../retail_api/retail.service'
import {OrdersResponse} from '../graphql'

@Resolver('Orders')
export class OrdersResolver {
    constructor(private retailService: RetailService) {
    }

    @Query()
    async getOrders(@Args('page') page: number): Promise<OrdersResponse> {
        return this.retailService.orders({page})
    }

    @Query()
    async getOneOrder(@Args('number') id: string) {
        return this.retailService.findOrder(id)
    }

}

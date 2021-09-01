<template>
  <div class="test-panel">{{ a }}</div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { apiConfig, post } from '@/utils/api/Interfaces'
import { mixins } from 'vue-class-component'
import getUserInfo from '@/components/mixins/getUserInfo'
import { Carousel, CarouselItem, Pagination, Dialog, Button } from 'element-ui'
import * as I from '@/assets/types/home'

@Component({
  name: 'Test'
})
export default class Test extends Vue {
  a:string = ''
  mounted () {
    post(apiConfig('test/test'), {})
      .then((res:any) => {
        console.log(res.data)
      })
  }
}
</script>

import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $ec: any
  }
}

declare module L {
  namespace myPolyline {
    interface L {
      Polyline: any;
    }
  }
}

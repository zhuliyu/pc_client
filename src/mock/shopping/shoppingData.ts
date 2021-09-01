const Mock = require('mockjs')
const Random = Mock.Random

/*
*  首页-应用列表 */
function shoppinMockgData (name:string) {
  switch (name) {
    case 'commitOrder': {
      return {
        'outTradeNo': 'H81H2121J32H1'
      }
    }
    case 'getCashierData': {
      return {
        'time': 10000,
        'price': 7020.22,
        'title': '图纸通',
        'userId': '',
        'outTradeNo': '',
        'type': '',
        'notPayOrderOnPc': [{ 'goodsName': '图纸通-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1', 'goodsCount': '2', 'goodsPrice': '0.01' },
          { 'goodsName': '图纸通-2-2-2-2', 'goodsCount': '2', 'goodsPrice': '0.01' },
          { 'goodsName': '图纸通-2-2-2-3', 'goodsCount': '2', 'goodsPrice': '0.01' },
          { 'goodsName': '图纸通-2-2-2-4', 'goodsCount': '1', 'goodsPrice': '0.01' }]
      }
    }
    case 'getPaymentInfo': {
      return {
        'actualPayPrice': '7020.22',
        'payType': '支付宝',
        'payTime': '2020-12-20 16:56:01',
        'outOrderNo': '2020122232323232'
      }
    }
    case 'getOrderList': {
      return [
        {
          'appId': 'app1',
          'goodsDetail': [
            {
              'facilitatorName': '杭州新迪数字工程系统有限公司',
              'goodsCount': 2,
              'goodsId': 'good1',
              'goodsLogo': '../../img/order/logo.png',
              'goodsName': '图纸通企业版',
              'goodsPrice': '2340.00'
            },
            {
              'facilitatorName': '杭州新迪数字工程系统有限公司',
              'goodsCount': 1,
              'goodsId': 'good2',
              'goodsLogo': '../../img/order/logo.png',
              'goodsName': '图纸通企业版',
              'goodsPrice': '2340.00'
            }
          ],
          'orderNo': 'no123123',
          'orderStatus': 'TRADE_WAIT_PAY',
          'orderTime': '2020-12-20 16:54:32',
          'outTradeNo': 'no324324234',
          'totalNums': 2,
          'totalPrice': '7020.00'
        },
        {
          'appId': 'app2',
          'goodsDetail': [
            {
              'facilitatorName': '杭州新迪数字工程系统有限公司',
              'goodsCount': 1,
              'goodsId': 'good3',
              'goodsLogo': '../../img/order/logo.png',
              'goodsName': '图纸通企业版图纸通企业版图纸通企业版图纸通企业版图纸通企业版图纸通企业版',
              'goodsPrice': '2340.00'
            }
          ],
          'orderNo': 'no333333',
          'orderStatus': 'TRADE_SUCCESS',
          'orderTime': '2020-12-20 16:54:32',
          'outTradeNo': 'no324324234',
          'totalNums': 1,
          'totalPrice': '2340.00'
        },
        {
          'appId': 'app2',
          'goodsDetail': [
            {
              'facilitatorName': '杭州新迪数字工程系统有限公司',
              'goodsCount': 1,
              'goodsId': 'good3',
              'goodsLogo': '../../img/order/logo.png',
              'goodsName': '图纸通企业版图纸通企业版图纸通企业版图纸通企业版图纸通企业版图纸通企业版',
              'goodsPrice': '2340.00'
            }
          ],
          'orderNo': 'no333333',
          'orderStatus': 'TRADE_CLOSED',
          'orderTime': '2020-12-20 16:54:32',
          'outTradeNo': 'no324324234',
          'totalNums': 1,
          'totalPrice': '2340.00'
        },
        {
          'appId': 'app2',
          'goodsDetail': [
            {
              'facilitatorName': '杭州新迪数字工程系统有限公司',
              'goodsCount': 1,
              'goodsId': 'good3',
              'goodsLogo': '../../img/order/logo.png',
              'goodsName': '图纸通企业版图纸通企业版图纸通企业版图纸通企业版图纸通企业版图纸通企业版',
              'goodsPrice': '2340.00'
            }
          ],
          'orderNo': 'no333333',
          'orderStatus': 'TRADE_CLOSED',
          'orderTime': '2020-12-20 16:54:32',
          'outTradeNo': 'no324324234',
          'totalNums': 1,
          'totalPrice': '2340.00'
        },
        {
          'appId': 'app2',
          'goodsDetail': [
            {
              'facilitatorName': '杭州新迪数字工程系统有限公司',
              'goodsCount': 1,
              'goodsId': 'good3',
              'goodsLogo': '../../img/order/logo.png',
              'goodsName': '图纸通企业版图纸通企业版图纸通企业版图纸通企业版图纸通企业版图纸通企业版',
              'goodsPrice': '2340.00'
            }
          ],
          'orderNo': 'no333333',
          'orderStatus': 'TRADE_CLOSED',
          'orderTime': '2020-12-20 16:54:32',
          'outTradeNo': 'no324324234',
          'totalNums': 1,
          'totalPrice': '2340.00'
        }
      ]
    }
    case 'deleteOrder': {
      return true
    }
    case 'cancelOrder': {
      return true
    }
    case 'getOrderInfo': {
      return {
        'time': 20000,
        'actualPayPrice': '6666.66',
        'totalPrice': '7022.00',
        'tradeStatus': 'TRADE_WAIT_PAY',
        'goodsDetail': [
          {
            'facilitatorName': '杭州新迪数字工程系统有限公司',
            'goodsCount': 2,
            'goodsLogo': '../../img/order/logo.png',
            'goodsName': '图纸通企业版',
            'goodsPrice': '2340.00'
          },
          {
            'facilitatorName': '杭州新迪数字工程系统有限公司',
            'goodsCount': 1,
            'goodsLogo': '../../img/order/logo.png',
            'goodsName': '图纸通企业版',
            'goodsPrice': '2340.00'
          },
          {
            'facilitatorName': '杭州新迪数字工程系统有限公司',
            'goodsCount': 1,
            'goodsLogo': '../../img/order/logo.png',
            'goodsName': '图纸通企业版',
            'goodsPrice': '2340.00'
          },
          {
            'facilitatorName': '杭州新迪数字工程系统有限公司',
            'goodsCount': 1,
            'goodsLogo': '../../img/order/logo.png',
            'goodsName': '图纸通企业版',
            'goodsPrice': '2340.00'
          },
          {
            'facilitatorName': '杭州新迪数字工程系统有限公司',
            'goodsCount': 1,
            'goodsLogo': '../../img/order/logo.png',
            'goodsName': '图纸通企业版',
            'goodsPrice': '2340.00'
          }
        ],
        'orderInfo': {
          'creatTime': '2020-12-04 16:54:32',
          'invalidTime': '2020-12-20 16:54:32',
          'outTradeNo': '202012041654327654321',
          'payTime': '2020-12-20 16:56:01',
          'payType': '支付宝',
          'tradeNo': '202012201656011234567890'
        }
      }
    }
    case 'getWeixinQrCode': {
      return {
        'img': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAIAAAAP3aGbAAAJb0lEQVR42u3bQXLbQBAEQf7/03boCY4wNd29WXdA0HImccLnjySV9HEEkoAlScCSBCxJApYkAUsSsCQJWJIELEnAkiRgSRKwJAFLkoAlScCSBCxJApYkAUsSsCQJWJIELEnAkiRgSRKwJAFLkoAlScCSBCxJApYkYEkSsCQJWJKAJUnAkiRgSQKWJAFLkoAlCViSBCxJApYkYEkSsCQJWJKAJUnAkiRgSQKWJAFLkoAlCViSBCxJApYkYEkSsH6ecq7M//d7T+XO7TMJLGABC1jAAhawsAIsYAELWO4MLGABC1jAAhawgIUVYAELWMByZ2ABy3AAC1jAAhawsAIsYAELWO4MLGD923DsPfP3/t/Mk9x7qdgjYAELWMACFrCABSxgAQtYwAKWPQIWsIAFLGABC1jAAhawgAUsYNkjYAELWMACloMGFrCABSxgAQtY9ghYN8vwGjpXn300IvvaTALLcAALWMACFrCAZSaBZTiABSxgActwAAtYwAIWsIBlJoFlOIAFLGABy3AAC1jAAhawgGUmgWU4gAUsYAHLcPSh0zgbZhJYwAIWsMwksAwHsIAFLGABC1hmEljAAhawzCSwDAewgAUsYAELWGYSWMACFrCABSzDASxgAQtYwAKWmQSW4fiNwbr6fxtpMJPAAhawgAUsYAELWMACFrCABSwzCSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYwFo76L2B3vu7ZhJYDhpYwAIWsIAFLGABC1jAApaZBJbhAAew7BGwgAUsYAELWMAClpkEluEAB7DsEbCABSxgActBAwtYZhJY3zroxq6wc23+SyVzJoEFLMsPLGABC1iuBRawgAUs1wILWMCy/MACFrCA5VpgAQtYwHItsIBlOCw/sIAFLGC5FljAAhawXAssYL1e5thdrfcVHOYQWAIWsAQsYAELWMASsIAlYAlYwBKwgAUsYAFLwAKWgCVgAUvAAhawgAUsAQtYAlbfUGYuYeZJZv4Ke5/I+DQHWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jASgFr7+/unfNrJ5n5Qlo4OmBZM2ABC1jAAhawgAUsYAELWMACljUDFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrA2fuDGj0Iyx33vUxV39mkOsIAFLGABC1jAwgqwgAUsYLkzsIAFLGABC1jAAhZWgAUsYAHLnYEFLGABC1jAAhawsAIsYAELWO4MrD7srp5qj1EEJ6ADLGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgAStlvTPHvZHg1yjce9UBC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYwPq9Hymzq9FpBKvxNPZescACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhaw9n/+K+wyRxZJ7XsELGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAKW5QcWsIAFLGABC1jAAhawgAUsYFl+YAELWMACFrA60Hlt7Lw2/tdTfe9XaJxnYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABaxOsxtHJXNHX1nuPpMxXHbCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgLUJ1tXPsLfAmQOduYSZr5zGuQIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrA2wWr8+RvH7hNZI5RXBAMLWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jAWihzzRop3HupvIYssIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABawUVjKXP3PskNQ+dcACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhaw1EfSFdCZBDee5P5q0AFYwAIWsAQsYAELWMACFrCAJWABC1jAErCABSxgAQtYwAKWgAUsYAFLwAIWsIAFLGABC1gtC7z3+cXeMjQSfHXt3kddwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMAC1otg7T3zHjrf+4+urs18AQMLWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jA2l/+zOHYO43M/yizeZKABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYA2C9dozvzZXwAKW5QcWsIAFLGABC1jAApZnBhawgAUsYAELWMACFrCABSxgeWZgAQtYwAIWsIAFLGABC1jAAhawgAUsYN0sf+a4N55V5rVXmzLAGbCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgDUC1h6yjeg05gUMLGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgAcsypA9l5mlgZfvFDyxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYEkSsCQJWJKAJUnAkiRgSQKWJAFLkoAlCViSBCxJApYkYEkSsCQJWJKAJUnAkiRgSQKWJAFLkoAlCViSBCxJApYkYEkSsCQBS5KAJUnAkgQsSQKWJAFLErAkCViSBCxJwJIkYEkSsCQBS5KAJUnAkgQsSQKWJAFLErAkCViSBCxJwJIkYEkSsCQBS5KAJUnAkgQsSQKWpKf7CxvTW9Qn4BiUAAAAAElFTkSuQmCC',
        'content': 'weixin://wxpay/bizpayurl?pr=nud7Ctr'
      }
    }
    case 'getAlipayQrCode': {
      return {
        'img': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAIAAAAP3aGbAAAXTUlEQVR42u3aW3Yjy65lwd3/Tp/qwR2VgQkESRk+lZIYD7h5ajn++59SSn1J/ecRKKWApZRSwFJKAUsppYCllFLAUkoBSymlgKWUUsBSSgFLKaWApZRSwFJKAUsppYCllFLAUkoBSymlgKWUUsBSSgFLKaWApZRSwFJKAUsppYCllFJrYP03q3/6iH/6nv/js559+rOLr57Ys+czvPdnn5U/+b1m+/+51Mv7enan1bp4ZXUDC1jAAhawgAUsYAHrZ8Aa/lT1+PJ2f/YLq84bLrZ/atOqz/agGe40w0YaLsjhb64u7GB7AxawgAUsYAELWMAC1h8Ha9h51dPP/4zPE4e9ZfPK8hsugCrorOLRivgqhKocH/7mvesBFrCABSxgAQtYwALWHwdr771WMdDlQf7w4vOXezA1MmRuaOKwaas2Hrbfh+RuwAIWsIAFLGABC1jAAtbXZVh74VG1EvYCi+oo/ZWRheFrOmBuLxXNmQMWsIAFLGABC1jAAhawErDyhhs2SjVYsHfY/+woPW/lvYwvF2doUP57hhnfwa7/StsAC1jAAhawgAUsYAHrT4F1eWbsK77iK5dfyYM8YPmKr/gKsIDlK74CrJ8B67L+KY16FgdUAVN+rlyNPgxP4vfO7/OHudctw+QrH+B4dvE34wjAAhawgAUsYAELWMD6ebCGiVWlyd6B7isfWnmXBxbD9z78rL372qshhR/C3HDvARawgAUsYAELWMAC1p8Ca/iIq0WSR0V7EdizRzfMaIY0Hzy6IanP2vgVUod2DPnOI7kvm8MCFrCABSxgAQtYwALWvlwHIwJ5T1dr/vJ4u4oeqreTJ3FDJffuqxI5v56DGPrLMixgAQtYwAIWsIAFLGAdglUFDfmKGnZw/mKqAK7aRfaW8cGp/57a1fXkT2zYSAe6AQtYwAIWsIAFLGABC1jJX++VQXkQc0BP3jH5wzwIHw/uqzrRH07eVHMteWv976UCFrCABSxgAQtYwALWN4I1DEeeHRVXIVSeAlT9+k/XkzdctXqfvaa9jObZOMLH7kbDl1LNvgALWMACFrCABSxgAetPgbV3t9Xq3cspnoVieUKUDx/sxXZ5YnWQGeUtehBCHahdPUNgAQtYwAIWsIAFLGB9KViVOM/effVihgLmC/tDGmUPkfx2nm2Kl6Tm2/9BuDaMt4AFLGABC1jAAhawgPWnwNqroVwH8VZ+Gl0t/r3U7yDWzPt+mK7mgxd7m2uViu5FscACFrCABSxgAQtYwPoZsD7k8VVH8sMbzMeRq5ijysv24NubZsij2IOtYriRVz3/LOcCFrCABSxgAQtYwALW3wQrTwouT6Pz8/sqLxveaU7qs1VX7UZ74gy3iuphVl23F+nuBZ3AAhawgAUsYAELWMD6drDyM9rqXPmgh/b6vmruvRbcy7mG3ZJ/xN4GnJs4dDzvQ2ABC1jAAhawgAUsYP0wWNUQc946VTSTTzwfRHKXsctBk+xNTlSdWW3Jz55hvstWoSGwgAUsYAELWMACFrD+Alj5/Q97qPoLf+9v9aFBebRX5S8Hy2ZvXGMv1rxELc/v9qJPYAELWMACFrCABSxg/XGwqq4a9uLwm/eCmKHje5HcXrg2bIDh2MfBIf1eFFs1wFsjC8ACFrCABSxgAQtYwPoNsN7NX4bXczArcDkHcPB89i6sWpB5lPZK2HeAyPDin/0eYAELWMACFrCABSxg/QxY1cjCXliTm3h5HlxNe1SH63uH4nuh2IGb1cvNl1W1df1OhgUsYAELWMACFrCABax9sIbDtc++J88XDrKVYahRBTEHHOxNseyFhnvwDWdo8s116NTNMASwgAUsYAELWMACFrA+f6whXyQHccleWrcXCA6zlfxVVllPbv3lOEu+o1cLJF+eb+VcwAIWsIAFLGABC1jA+mqw8hjoWV52OSKQn2EP88QqYKre+17fP3vvw5+6XOHVuM/e1vX1GRawgAUsYAELWMACFrDW+vWV/tg7Kq7CiPxS88xoOD0wvJ68/fJt8lm3VPlmNbMyTIRX4y1gAQtYwAIWsIAFLGB90SnhMLDIpxmGayw/YK7oqbrqlbczdKHaIar4Zth++bY03E72RjGABSxgAQtYwAIWsID1e2ANc5M8qMpXQpX+VD+ex1LP1sbBYX8+ofJp9SFpVNUkz7ZAYAELWMACFrCABSxgfTtYew8rfyJVE+S/J6enyqf2nliVA+6NdOSJ50FU9C5qwAIWsIAFLGABC1jA+ptgPWvB6lnvNdze0MBeunHwEPJ3ujeFkAdew4/IY6lXkq/hygUWsIAFLGABC1jAAtbvgbWXED3r+70FOeR7GFQ9w6g6Za9Sknfp2VuHz7LCyrvKjjyXBBawgAUsYAELWMACFrCWXsPl5MQBEHl35j1UrbFhypYng5c3+CyWqlbcu3cKLGABC1jAAhawgAWsvwDWXudVedBerjS802FaV2U9w22papJnO0S1/PKefyX0yQGtFiywgAUsYAELWMACFrB+D6xX/ki+PMyuVstl3//T7znYBi63nGfs5m/wYHLi8i7yFBJYwAIWsIAFLGABC1h/E6xnz+ggPMr7Iwc0f7xD3Q5+YT4+spcDVu2X76CvvAJgAQtYwAIWsIAFLGD9TbCqsCY/+R52ebVs9gYv8muuXkGV0VTt9+54xKWkVYBb7bvAAhawgAUsYAELWMD6YbD2TvTfHQh4ZXog/4gqcvqQuYS9ljjoww9p2iqqPg6zgAUsYAELWMACFrCA9fkZ1sHf4ZWbw++pDpj3XBiuw/zAey9Kq9KoKpfMA68qk33WG/k1AwtYwAIWsIAFLGABC1hJn+XH2/mh+LOj4r3V+0qwWO1qeTY3jBH3mm2o7bOWOBAAWMACFrCABSxgAQtYPwzW5fn0cDb3WedVodhwkbzbQ1XKdgBNDkS1wQxb9HKP/xAKgQUsYAELWMACFrCA9RVgDQ/7nx2y7v3moSav/NMrOO6tw3xt5BtVFQjmu37lXRXOAgtYwAIWsIAFLGAB6y+AVaGWD+DmswuVJlV8s4fIAd/VLjKcyc4/verevd368j8NwAIWsIAFLGABC1jA+lNgXb6hKsvYWzb5oq0Iy/t+76eebYHVqMpeWDMcmNgb6bjc7IEFLGABC1jAAhawgPUzYFUdU33EXldVsUK1Vp810/AgPz9lvzyJzxtgCOhBMjhcX3kfAgtYwAIWsIAFLGAB64fBygmrUpLqjL9K614J+4ZuVtc8vJ78Vb67Ae+9r3x7q7QFFrCABSxgAQtYwALWD4OVt071p35V/9RD1TF5dc1Vv+4d5O+lWvk+N2y/KqmsOvOVlgAWsIAFLGABC1jAAtbvgVX9Pf/Kqxou9YrUKg7I/R3CtzdYUC2bveP/fC5hb7OvwjVgAQtYwAIWsIAFLGD9TbDyk/i96GrYgtXgxUH0MKQ5n9IYRnv5NQ9jqTw4q5ZePouTiwwsYAELWMACFrCABazfAyt/snn68wyaSsk8qMr3jIPM6CBGrHTbGyg5+PS9jjr4dGABC1jAAhawgAUsYH0XWHu5UhXNVNMVVa50sPgvD/KHjZsTtpepVSnbXh70TJODhBFYwAIWsIAFLGABC1jAShqu+oM8P/StGqVa4cOca7h6n13qUNvhNrCXMA4vPl8O+TNcdQpYwAIWsIAFLGABC1jfCNbQoGocoQqz8u/5EH/33mluR/XeD2K7Z3vY3mcNH0K+8wELWMACFrCABSxgAeuHwapyinxSYW82dxg97OV31S1f5pLDVffsm4fQDDez4Tc/C1WrH6/SQ2ABC1jAAhawgAUsYP0eWAdkDFfLP7XOZbtXOFaPpUpkquCs6o13K0c/53uvjYEFLGABC1jAAhawgPV7YO3NExycxB/EUnuOD7XN+z6f7cgvfq/9qjTqgLm9dQosYAELWMACFrCABSxgLZ1qV2HNZf4yvJ6DtC5P4i6vZ3imvuf4wWsabmZ729sqYcACFrCABSxgAQtYwPpYsPIUYLjCq3yhWmzVTEbOXBX27eWJw/dVTUXkd7o3wVNtnNV/CIAFLGABC1jAAhawgAWspajoY4/th7c8hGavOw8yx4MmGSZxeRi6t8KrkaC9lwIsYAELWMACFrCABaw/BVYe3wzXc3WFeU/nB/l7Ile6vXv8v7fzDROry0mXHH1gAQtYwAIWsIAFLGD9cbCG4UiVQQyX1ivn9wcBXPUL88mJZ/4OJwOGLbqnSdUbBzHZ8DkDC1jAAhawgAUsYAHr28GqeNr7pyr0ebfLq58avrjhoEMVl+TTJ8OXu7cKchcOYs0NuYAFLGABC1jAAhawgPX5YOXH9sMwYrjG/ukFH+Rl1YF3PiPy7L6edctlrw653FsF1Y5V7fHfmmEBC1jAAhawgAUsYAFrrar3+u5R+vAUOc8Bh6lEFSMO39cwOKtW5jAnHY4jPNvVDsYs8tUNLGABC1jAAhawgAWsvwDWZWCR/57hoW9+xJt/xKUveUvsDWcMb6dqpD3Qh3fx7Il9WegOLGABC1jAAhawgAWsNbCqrjoYR6jCmme6Vf2Rn44PH92BgHn7PYtvqjC0ikerYYjqaQALWMACFrCABSxgAeuPg3UQoFSnrXmj5Atp7wb3wpG9B14tyP/q2uuoIaDVEEPV/MACFrCABSxgAQtYwPphsIbHwMOoKM8g9npoD6O8BZ+tw3zIYwjN5ZZcRYQfIvuz/4UAC1jAAhawgAUsYAHrT4E1DAiqlTn8rMuT5gN2q6YcZnN7T74aVanufWhrnopefvpqAQtYwAIWsIAFLGAB62PBygOLV87UcyXzOx2GUMOHOUz9honeXpaabxV5jJiLXLXxsWXAAhawgAUsYAELWMD6/Ayr+jN+b7g274+95Zczd0l8vjLzMKuKWav7qlK/Z/08bOwbuYAFLGABC1jAAhawgPX5GVbVuJcLoDIxT1s+ZNrjYCXkodje+xomRFVW+EoCm097AAtYwAIWsIAFLGAB64fBGp6pVz9+2V5VqpXnXFUslSc7+cKu7qvK7yrv9maD9sLQDcKABSxgAQtYwAIWsID1sWBV89Z5vFWdWFddtafbZT61d/JdLaTh27nke28/qN7gQcoGLGABC1jAAhawgAWsnwErn/+uNMnzhb0c5xX48scy7PLhu3iF1INQ9ZVnuGoQsIAFLGABC1jAAhawfhWsakChWvzVWENuaxXWVKsl/0qVb1bNlqda1TLOE9i9CYO3dAMWsIAFLGABC1jAAtY3nhIOz3Gr09bLp78XxOQn8cOHOSQ1D6HyiYc976q3fPkfgremGYAFLGABC1jAAhawgPX5YD3rvIO0ZejC3kH13qXuuZCnSFXbPDN67xcezMcMf3P1U8ACFrCABSxgAQtYwALW5A/y/Fh6GHw8u7Bq+CDPeqrryVOb4Yoa9uFBNlcFcK/0Rr4GgQUsYAELWMACFrCA9RfAOjgcHYZHB62cn80PWzlPmg7oqTohnx7I5xI+ZMgjb7ZVuYAFLGABC1jAAhawgPWxYFXR1d6zHp5Y79m615R7cxvVLrI3PVBtnHt3ehngVu/9ZnYBWMACFrCABSxgAQtYXw1WZVAVjuy913/qvOpOn80cVAHK8BXkudswhBre+zODDkYfhslyfqfAAhawgAUsYAELWMD6U2Dlx6UH6UaeEO2tzKq99pZx9U4vA5S9thlub5eP7nJfARawgAUsYAELWMACFrDav42roYH83Vfh2kEoVl3zK6HYwfrJE7Q8Sz24DGABC1jAAhawgAUsYAGrPTd914XqyLm602eW5W9nz4780w/ezsGPVw/z2XvPb/BbxxqABSxgAQtYwAIWsIBVHwy/Al9+UD18H9XwwfCf8jPsvW6p+mfvUqttcm8rreK2vbUMLGABC1jAAhawgAWs3wPr3RznGXPDLt+b2zgIYvID78uEqKLwMlh8ZRXsRWBVugosYAELWMACFrCABazfA6vq+70+G7bXK/e+R8/lkMeQlYMGqHKlauPcy1vz7TZPD4EFLGABC1jAAhawgPVdYOUn6NWyedYNlQJ759xVPHHwCvJz9/xIPh8oqbKefJgmf93fmmEBC1jAAhawgAUsYAFrLcOqbqk6Ha+Snfwu8lPk4axAlUEcHKUfZGF7/Zzf6YGJw3ENYAELWMACFrCABSxg/Smwqlygil2evdf8F+7FJc9MHH7z3jutSB3uRlWIObyd4eDF8A1WjQ0sYAELWMACFrCABSxgtcMHe407TNCGAUHVVfkSrb55L9EbcnAw1rAXDOXp2HA6Z3W+AVjAAhawgAUsYAELWB8L1of0R/U9w3xqT/ZqkiOHL083DgYvqu6t0p9qmiFvyP99TAELWMACFrCABSxgAes3wPqnH/+0fGFIz8FAwLPXVAWC1VLPJwMOHu/eAqkip70bvPEOWMACFrCABSxgAQtY3wjWs0RmqMnepMK70dWwTavwKL/UoexDW6ulftB1eylb9V+Er8+wgAUsYAELWMACFrCAtUZYnnNVqc2z1VJNRVRNsLfqhvf17C1f0jPcQfcWbYVaNfpQrQtgAQtYwAIWsIAFLGD9Hlj5H+SVOPkxcHWpFRlDaPbysuEtD79SdcswU3sWFe1tS3mrH6gNLGABC1jAAhawgAWsnwFrb77h2Suvlk2ebhycEFexXWXr8A3m2VyefOWjM9XeU+0rN4MOwAIWsIAFLGABC1jA+liwqvd6+ePDYOhgYGIv+Xr24qrbqXKlyru9SY6D93WQk+7tzcACFrCABSxgAQtYwPphsKo3/SwFqM6w8yjkMgWoQH8mTn7Ne8zlGc3edrv3wKu9ZxcTYAELWMACFrCABSxgfSpYVbvnf3XnvlTpzys4VvrnYV+lyd5WMbz3KsTce03H9AALWMACFrCABSxgAevHwKpSrfzP5uqVDwOdyo4DBS6zy2H2VD3DYf/kL/fyVea70WprAQtYwAIWsIAFLGAB62PBeuVhPeu8g4arhiqG1lesDLeTqt3zKY0hl68s7GoH3ctkvz50BxawgAUsYAELWMACVg1WdcCcn+wOhyr2juSfbQP5qf8wx3k2NLCXNO1h/SGL6Nl9VXd6YxmwgAUsYAELWMACFrC+CKwqbanSsWfv/uDiqyhkLzwaroRh1DhcAMPrucRx2Mb5jx+8HWABC1jAAhawgAUsYP0MWJep1jAGGp7N58jmkxP56s1nVg4WSb6D7j264eaad28eHwMLWMACFrCABSxgAetPgXWZT+UG5SuzioqefVZF2PBhVlHauyMLw9mX6sVV4yNVj91MMwALWMACFrCABSxgAesbTwmr5KtafsPGffamh3/z59lKFVRVdzpMbYabULXC99KoZ3w/++b8nX5Z6A4sYAELWMACFrCABaw6uqr+5t87Qd879H32lcqOg4bLc5N39c91q3LbvXfx7NHl3QssYAELWMACFrCABazfA2vvp145Sd1ryirUyOcShkviWco2jF2G3fJsGQ8vrAqYDkLeX86wgAUsYAELWMACFrCAtb+w87+NhzjuxQHDRO+V/qiGPPZsrUZVho6/8ljyzTVvtsv/PQALWMACFrCABSxgAetPgbU3qVBdTxVLVSHd8GHmJ/p7zZ2PLOR87yV61f8D9lriW8cagAUsYAELWMACFrCA9algVUHV3rF0PrKQP5/82L6aUKlixGqFvzKdk7dWhfUwCwMWsIAFLGABC1jAAtYfB6s6iN1LLt49tc3TsfzouurX6jXlCzIPDfc4qIYzqt36rUEHYAELWMACFrCABSxgfT5Yw1saNm7eBM86Zu8v/L3HW316tYflow97nTA0ei8ZrPb4PceBBSxgAQtYwAIWsID1M2AppdR2AUspBSyllAKWUgpYSikFLKWUApZSClhKKQUspZQCllIKWEopBSyllAKWUgpYSikFLKWUApZSClhKKQUspZQCllIKWEopBSyllAKWUgpYSikFLKWUApZS6nvr/wES3EkvkxqlLAAAAABJRU5ErkJggg==',
        'content': 'https://openapi.alipay.com/gateway.do?alipay_root_cert_sn=687b59193f3f462dd5336e5abf83c5d8_02941eef3187dddf3d3b83462e1dfcf6&alipay_sdk=alipay-sdk-java-dynamicVersionNo&app_cert_sn=3aa5e5d46a86bdfcbfc4cd75b9b61863&app_id=2021000199673968&biz_content=%7B%22subject%22%3A%22%E8%9C%82%E5%B7%A2%E4%BA%92%E8%81%94-100202006111035433749%22%2C%22body%22%3A%22%22%2C%22product_code%22%3A%22FAST_INSTANT_TRADE_PAY%22%2C%22timeout_express%22%3A%2230m%22%2C%22out_trade_no%22%3A%22100202006111035433749%22%2C%22total_amount%22%3A%220.04%22%7D&charset=utf-8&format=JSON&method=alipay.trade.wap.pay&notify_url=http%3A%2F%2Fnjtesthoneycomb.zhizaoyun.com%2Fgateway%2Fapi-pay%2FaliPay%2Fnotify&return_url=http%3A%2F%2Fnjtesthoneycomb.zhizaoyun.com%2Fgateway%2Fapi-pay%2FaliPay%2Freturn&sign=dZePrzzAqcy9OgAimCTJCXDf9qTZYJyDuLtGVZuHUoZNKX8MSib78SPeYP%2BsE%2FFH%2BPDWY%2FuDxXjSFTRkcP0aisIPUuY7OnKjB%2FoVOFsZSaPzv4aL%2FuBJdYFMWDr1DlKdl6SKhdFoNxsRSbfsvu1Y8hUpxqGec4eSGz6bvWkC%2BOTt2WPmYl5stZnySsLAiywfGppuAg%2FCwixD%2FgMfIIawUO%2FYydNDAGgxnb9iui9ukU09A3%2F7tleVLcvA3eFml%2F%2FjDk8cBKPLLC9uQsSngg4xA7cFy4wmDkyIsCuq8gIbWSEbyiWWXN0wZIFyFKvyu%2B%2B2gdXV3LsS7s5lXJ2kyQCxtg%3D%3D&sign_type=RSA2&timestamp=2020-06-23+17%3A26%3A39&version=1.0'
      }
    }
    case 'getPayStatus': {
      return {
        'orderStatus': 'TRADE_WAIT_PAY',
        'orderTitle': '蜂巢互联-100202006121731136313'
      }
    }
    case 'noticePayType': {
      return ''
    }
  }
}

export {
  shoppinMockgData
}

# vue3-minesweeper

Vue 3 で作ったマインスイーパ

https://sterashima78.github.io/vue3-minesweeper/

## 気が付いたこと

### v-model

プロパティ名が `value` であっても、明示的に `v-mode:value` や `update:value` とする必要があった。

### props

`@vue/compositon-api` では `setup` の第一引数に対して型付けが必要(なはず)だったけど Vue3 では必要なかった。

### コンポーネントに渡す値の初期化

どこで引っかかっているのかよくわからないけど、 `Minesweeoer` コンポーネントから `SelectNumber` コンポーネントに `v-model` 経由で `select` の `value` へ属性をパスしていたけど、 `ref(10)` と setup で宣言したままだと、正しく `select` の `value` には反映されていなかった。

`onMounted` で値を更新すると反映されるようになった。

### Typescript 3.9.3 で型チェックエラー

以下でライブラリの型チェックをスキップする必要があった。

```
  "skipLibCheck": true,
```

## そのほか

`@vue/composion-api` 使ってたらそれほど困らなかった。

fragment とか使いたかったけど vetur がうるさいから今までどーりルートエレメントは一つにした。

Suspense, Teleport とかも無理やり使いたくなかったので使っていない。
ただ、この辺は個別ケースなので普通に書くのには特に困らないからよかった。
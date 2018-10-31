<template>
  <transition name="fade" mode="out-in">
    <b-img v-if="!ready" src="/img/loading.gif" class="rubik"></b-img>

    <main id="app" v-else>
      <!-- #wp-header -->
      <b-header id="wp-header" />

      <!-- #wp-body -->
      <main id="wp-body">
        <b-container>
          <b-row>
            <!-- .blog-main -->
            <b-col class="blog-main" lg="8">
              <!-- content -->
              <transition name="fade" mode="out-in">
                <keep-alive>
                  <router-view />
                </keep-alive>
              </transition>
            </b-col>

            <!-- #wp-sidebar -->
            <b-sidebar
              v-if="ready"
              id="wp-sidebar"
              class="blog-sidebar col-lg-4"
              :sidebar="$theme.sidebar" />
          </b-row>
        </b-container>
      </main>

      <!-- #wp-footer -->
      <b-footer id="wp-footer" />
    </main>
  </transition>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { configMathJax } from '@/common/js/mathjax';
import { IContext } from '@/store';
import { ISidebarItemConfig } from '@/models/theme';
import { FETCH_META, FETCH_DETAILABLE_TARGET } from '@/store/types';
import BHeader from '@/components/header/BHeader.vue';
import BFooter from '@/components/footer/BFooter.vue';
import BSidebar from '@/components/sidebar/BSidebar.vue';

@Component({
  components: { BHeader, BFooter, BSidebar },
})
export default class Layout extends Vue {
  private ready: boolean = false;

  // fetch initial global data
  private async asyncData({ store }: IContext) {
    await store.dispatch(`meta/${FETCH_META}`);
    /* tslint:disable:no-console */
    console.log('meta fetched');

    // define 404 page
    const page_404 = store.state.meta.themeConfig.page_404;

    if (page_404.enable) {
      const source = page_404.source_path.replace(/\.md$/, '');
      await store.dispatch(`detailable/${FETCH_DETAILABLE_TARGET}`, { isImplicit: true, sourceOrSlug: source });
    }
  }

  private mounted() {
    this.$nextTick(configMathJax);
  }

  @Watch('$theme.sidebar')
  private onSidebarLoaded(val: ISidebarItemConfig[]|null) {
    if (!val || val.length < 1) {
      return;
    }
    this.ready = true;
  }
}
</script>

<style src="@/common/stylus/style.styl" lang="stylus"></style>
<style lang="stylus" scoped>
.rubik
  width 64px
  height 64px
  position absolute
  left 50%
  top 50%
  transform translate(-50%, -50%)
</style>

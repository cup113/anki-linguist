<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { NavigationMenuRoot, NavigationMenuList, NavigationMenuItem } from 'reka-ui';
</script>

<template>
  <header class="p-2 border-b border-b-gray-500">
    <NavigationMenuRoot>
      <NavigationMenuList class="flex gap-8 mx-auto rounded-xl px-4 py-2 justify-center">
        <NavigationMenuItem class="text-gray-700 font-semibold">
          <RouterLink to="/">Home</RouterLink>
        </NavigationMenuItem>
        <NavigationMenuItem class="text-gray-700 font-semibold">
          <RouterLink to="/about">About</RouterLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenuRoot>
  </header>

  <RouterView />

  <footer class="border-t border-t-gray-500 p-2 mt-20">
    <div class="text-center text-gray-500">
      cup11 © 2025
    </div>
  </footer>
</template>

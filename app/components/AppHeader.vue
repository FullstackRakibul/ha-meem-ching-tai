<template>
  <header class="bg-white shadow-sm rounded-md flex items-center justify-between px-4 py-2">
    <!-- Logo -->
    <div class="flex items-center gap-2">
      <UIcon name="i-heroicons-lightning-bolt-16-solid" class="text-purple-600" />
      <span class="font-bold uppercase text-gray-900">ZEUS UI</span>
    </div>

    <!-- Navigation Links -->
    <nav class="hidden lg:flex items-center gap-2">
      <ULink href="#" class="hover:text-gray-800">About us</ULink>
      <UPopover mode="hover" :popper="{ placement: 'bottom-start' }">
        <template #default="{ open, toggle }">
          <span @click="toggle" class="relative hover:text-purple-800 flex items-center gap-1 cursor-pointer">
            Solutions
            <UIcon name="i-heroicons-chevron-down-20-solid" :class="{ 'rotate-180': open }"
              class="transition-transform" />
          </span>
        </template>
        <template #panel>
          <div class="bg-white rounded-2xl shadow-lg p-4 grid grid-cols-4 gap-6 w-[700px]">
            <div>
              <h4 class="font-bold">Product</h4>
              <ul class="list-disc pl-3">
                <li>Use cases</li>
                <li>Testimonials</li>
                <li>Features</li>
                <li>User stories</li>
              </ul>
            </div>
            <div>
              <h4 class="font-bold">About</h4>
              <ul class="list-disc pl-3">
                <li>Company</li>
                <li>Team</li>
                <li>Awards</li>
                <li>Careers</li>
                <li>Contacts</li>
              </ul>
            </div>
            <div>
              <h4 class="font-bold">Resources</h4>
              <ul class="list-disc pl-3">
                <li>Blog</li>
                <li>History</li>
                <li>Cases</li>
                <li>Articles</li>
                <li>University</li>
              </ul>
            </div>
            <div class="relative">
              <div
                class="bg-linear-to-br from-purple-600 to-purple-800 rounded-full p-4 flex items-center justify-between">
                <span class="text-white">Latest arrival</span>
                <UButton color="white" outline>Read article →</UButton>
              </div>
              <div class="absolute top-0 left-0 w-full h-full bg-gray-100 opacity-30 rounded-2xl"></div>
            </div>
          </div>
        </template>
      </UPopover>
      <ULink href="#" class="hover:text-gray-800">Resources</ULink>
      <ULink href="#" class="hover:text-gray-800">Pricing</ULink>
      <ULink href="#" class="hover:text-gray-800">Contacts</ULink>
    </nav>

    <!-- CTA Button -->
    <div class="hidden lg:flex">
      <UButton color="purple" outlined>Try for free »</UButton>
    </div>
  </header>
</template>

<script setup>
</script>
<script setup lang="ts">
const resources = useState('resources')

await callOnce(async () => {
  resources.value = await useFetch('/api/resources').then(res => res.data)
})
</script>

<template>
  <NavBar />
  <div class="container">
    <div class="alert alert-info d-flex align-items-center">
      <Icon size="1.5em" name="lucide-info" class="me-2" />
      <span class="me-2">
        This data is sourced from community volunteers and feeback from
        users. Do you know of a resource that we don't?
      </span>
      <NuxtLink to="#" class="btn btn-primary ms-auto">
        Add a Resource
      </NuxtLink>
    </div>
    <!-- map goes here -->

    <!-- list of resources goes here -->
    <ResourcesList />
  </div>
</template>
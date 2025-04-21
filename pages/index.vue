<template>
  <div class="flex bg-zinc-900 h-screen text-white overflow-hidden">
    <!-- Sidebar -->
    <aside class="bg-black w-64 p-6 flex flex-col border-r border-zinc-800">
      <!-- Logo -->
      <div class="flex items-center space-x-2 mb-8">
        <Icon name="lucide:pencil" class="text-amber-500" size="20" />
        <span class="text-white font-bold text-xl">Note<span class="text-amber-500">Nest</span></span>
      </div>

      <!-- Create Note Button -->
      <button class="text-sm text-zinc-400 hover:text-white flex items-center space-x-2 mb-8">
        <Icon name="lucide:plus" size="16" />
        <span>Create Note</span>
      </button>

      <!-- Notes Lists -->
      <div class="text-sm space-y-8 overflow-y-auto pr-2 flex-1">
        <!-- Today's Notes -->
        <div>
          <p class="text-xs text-zinc-500 uppercase tracking-wide mb-3">Today</p>
          <div class="space-y-2">
            <div
                v-for="(note, index) in notes"
                :key="note.id"
                @click="activeNote = index"
                :class="[
                'px-4 py-3 rounded-lg cursor-pointer',
                activeNote === index ? 'bg-amber-500 text-black font-semibold' : 'text-zinc-300 hover:bg-zinc-800'
              ]"
            >
              <p class="truncate">{{ note.title }}</p>
              <p class="text-xs">{{ note.preview }}</p>
            </div>
          </div>
        </div>

        <!-- Yesterday's Notes -->
        <div>
          <p class="text-xs text-zinc-500 uppercase tracking-wide mb-3">Yesterday</p>
          <div class="space-y-2">
            <div
                v-for="note in yesterdayNotes"
                :key="note.id"
                class="px-4 py-3 rounded-lg cursor-pointer text-zinc-300 hover:bg-zinc-800"
            >
              <p class="font-medium truncate">{{ note.title }}</p>
              <p class="text-xs text-zinc-400">{{ note.preview }}</p>
            </div>
          </div>
        </div>

        <!-- Previous 30 Days -->
        <div>
          <p class="text-xs text-zinc-500 uppercase tracking-wide mb-3">Previous 30 Days</p>
          <div class="space-y-2">
            <div
                v-for="note in olderNotes"
                :key="note.id"
                class="px-4 py-3 rounded-lg cursor-pointer text-zinc-300 hover:bg-zinc-800"
            >
              <p class="font-medium truncate">{{ note.title }}</p>
              <p class="text-xs text-zinc-400">{{ note.preview }}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-12 overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <p class="text-zinc-400 text-sm">{{ notes[activeNote].date }}</p>
        <button class="p-2 text-zinc-400 hover:text-red-500 transition-colors">
          <Icon name="lucide:trash-2" size="20" />
        </button>
      </div>
      <article class="space-y-6 text-zinc-100 text-lg leading-relaxed max-w-3xl">
        <p>{{ notes[activeNote].content }}</p>
      </article>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"]
});

const activeNote = ref(0);

const notes = ref([
  {
    id: 1,
    title: "Finally moved into my...",
    preview: "Tiny house today...",
    date: "November 22nd, 2024",
    content: "Finally moved into my tiny house today! After months of YouTube tutorials, countless trips to Home Depot, and more scrapes and bruises than I care to count, I'm officially a tiny home dweller. The sunset streaming through my handmade stained glass window makes the whole 240 square feet glow like a jewel box."
  },
  {
    id: 2,
    title: "Just finished reading...",
    preview: "The Midnight Library...",
    date: "April 20th, 2025",
    content: "Just finished reading The Midnight Library and I can't stop thinking about all the lives we could have lived."
  },
  {
    id: 3,
    title: "Today's recipe experi...",
    preview: "Attempted grandma's...",
    date: "April 20th, 2025",
    content: "Today's recipe experiment was a success! Attempted grandma's secret pasta recipe and it came out delicious."
  },
  {
    id: 4,
    title: "Dear future self, when...",
    preview: "When you read this...",
    date: "April 20th, 2025",
    content: "Dear future self, when you read this, remember how far you've come and be proud of your journey."
  }
]);

const yesterdayNotes = ref([
  {
    id: 5,
    title: "Met someone incredible...",
    preview: "Coffee shop...",
    date: "April 19th, 2025",
    content: "Met someone incredible at the coffee shop today. We talked for hours about books, travel, and life."
  }
]);

const olderNotes = ref([
  {
    id: 6,
    title: "First day at Google",
    preview: "10/12/24 · Orientation was...",
    date: "October 12th, 2024",
    content: "First day at Google was overwhelming but exciting. Orientation was intense but I met some great people."
  },
  {
    id: 7,
    title: "Hiking Mt. Rainier",
    preview: "10/3/24 · Six hours of climbing...",
    date: "October 3rd, 2024",
    content: "Hiking Mt. Rainier was the challenge of a lifetime. Six hours of climbing but the view was worth every step."
  },
  {
    id: 8,
    title: "Started learning violin",
    preview: "10/1/24 · These beginner notes...",
    date: "October 1st, 2024",
    content: "Started learning violin today. These beginner notes are challenging but I'm determined to master them."
  }
]);
</script>
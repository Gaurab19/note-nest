<template>
  <div class="flex bg-zinc-900 h-screen">
    <!-- Improved Sidebar with Title and Preview -->
    <div class="bg-zinc-800 w-72 border-r border-zinc-700 flex flex-col overflow-auto">
      <div class="p-4 border-b border-zinc-700">
        <Logo class="h-8 w-auto" />
      </div>

      <!-- Dynamic date-based sections -->
      <div class="flex-grow px-2 py-4 space-y-4 overflow-auto">
        <div v-for="(noteGroup, groupTitle) in groupedNotes" :key="groupTitle" class="mb-4">
          <p class="text-xs font-medium text-zinc-400 px-2 mb-2">{{ groupTitle }}</p>

          <div class="space-y-1">
            <div
                v-for="note in noteGroup"
                :key="note.id"
                class="px-3 py-2 rounded-md cursor-pointer transition-colors duration-150"
                :class="{
                'bg-amber-600': selectedNoteId === note.id,
                'hover:bg-zinc-700': selectedNoteId !== note.id,
              }"
                @click="selectNote(note.id)"
            >
              <!-- Note Title -->
              <h3 class="text-sm font-medium text-white truncate">
                {{ note.title }}
              </h3>
              <!-- Timestamp -->
              <div class="text-xs text-white mt-1 flex items-center">
                {{ formatTime(note.updatedAt) }}
              </div>
              <!-- Note Preview -->
              <p class="text-xs text-white truncate mt-1">
                {{ note.text.substring(0,60) }}
              </p>

            </div>
          </div>
        </div>
      </div>

      <!-- Add button -->
      <div class="p-3 border-t border-zinc-700">
        <button
            class="w-full flex items-center justify-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-md p-2 text-sm transition-colors"
            @click="createNewNote"
        >
          <PencilIcon class="h-4 w-4" />
          <span>New Note</span>
        </button>
      </div>
    </div>

    <!-- Note Editor Area -->
    <div class="flex-1 flex flex-col">
      <div class="p-4 border-b border-zinc-700 flex justify-between items-center">
        <!-- Title input field -->
        <input
            v-if="isEditing"
            v-model="editedNoteTitle"
            class="flex-1 bg-zinc-800 text-white px-3 py-2 rounded-md border border-zinc-700 focus:border-amber-600 focus:outline-none mr-4"
            placeholder="Note title"
        />
        <div v-else class="flex-1"></div>

        <!-- Action buttons -->
        <div class="flex space-x-3">
          <button
              v-if="isCreatingNewNote"
              class="text-green-500 hover:text-green-400 transition-colors"
              @click="saveNewNote"
          >
          </button>
          <button
              v-if="selectedNoteId && !isCreatingNewNote"
              class="text-zinc-400 hover:text-red-500 transition-colors"
          >
            <TrashIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <div class="flex-1 p-4">
        <textarea
            v-if="isEditing"
            v-model="editedNoteText"
            class="w-full h-full p-4 bg-zinc-900 text-white border border-zinc-700 rounded-md focus:border-amber-600 focus:outline-none resize-none"
            placeholder="Write your note here..."
            @input="handleNoteChange"
        ></textarea>
        <div v-else class="flex items-center justify-center h-full text-zinc-500">
          Select a note or create a new one
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const notes = ref([])
const selectedNoteId = ref(null)
const editedNoteText = ref('')
const editedNoteTitle = ref('')
const isCreatingNewNote = ref(false)
const isEditing = computed(() => {
  return selectedNoteId.value !== null || isCreatingNewNote.value
})

const groupedNotes = computed(() => {
  const groups = {}
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  notes?.value?.forEach(note => {
    const noteDate = new Date(note.createdAt)
    let groupTitle

    if (isSameDay(noteDate, today)) {
      groupTitle = 'Today'
    } else if (isSameDay(noteDate, yesterday)) {
      groupTitle = 'Yesterday'
    } else if (isWithinDays(noteDate, today, 7)) {
      groupTitle = 'This Week'
    } else if (isWithinDays(noteDate, today, 30)) {
      groupTitle = 'This Month'
    } else {
      groupTitle = 'Older'
    }

    if (!groups[groupTitle]) {
      groups[groupTitle] = []
    }
    groups[groupTitle].push(note)
  })

  return groups
})


// Handle creating a new note
const createNewNote = () => {
  isCreatingNewNote.value = true
  selectedNoteId.value = null
  editedNoteText.value = ''
  editedNoteTitle.value = ''
}

// Save the new note
const saveNewNote = async () => {
  if (editedNoteText.value.trim() === '') return

  try {
    // Here you would normally make an API call to save the note
    // For now, we'll just simulate it with a local update
    const newNote = {
      id: Date.now(), // Use a timestamp as a temporary ID
      title: editedNoteTitle.value,
      text: editedNoteText.value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add to the notes array
    notes.value.unshift(newNote)

    // Select the new note
    selectedNoteId.value = newNote.id
    isCreatingNewNote.value = false

    // Here you would add API call:
    // const savedNote = await $fetch('/api/notes', {
    //   method: 'POST',
    //   body: { title: newNote.title, text: newNote.text }
    // })
    // selectedNoteId.value = savedNote.id
  } catch (error) {
    console.error('Failed to save note:', error)
  }
}

// Select a note
const selectNote = (id) => {
  isCreatingNewNote.value = false
  selectedNoteId.value = id
  const note = notes.value.find(note => note.id === id)
  if (note) {
    editedNoteText.value = note.text
    editedNoteTitle.value = note.title || ''
  }
}

// Handle note changes
const handleNoteChange = () => {
  if (selectedNoteId.value && !isCreatingNewNote.value) {
    const noteIndex = notes.value.findIndex(note => note.id === selectedNoteId.value)
    if (noteIndex !== -1) {
      notes.value[noteIndex].text = editedNoteText.value
      notes.value[noteIndex].title = editedNoteTitle.value
      notes.value[noteIndex].updatedAt = new Date().toISOString()

      // Here you would add API call to update the note:
      // await $fetch(`/api/notes/${selectedNoteId.value}`, {
      //   method: 'PUT',
      //   body: {
      //     title: editedNoteTitle.value,
      //     text: editedNoteText.value
      //   }
      // })
    }
  }
}

// Helper functions
function isSameDay(date1, date2) {
  return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
}

function isWithinDays(date, baseDate, days) {
  const timeDiff = baseDate - date
  const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  return dayDiff >= 0 && dayDiff <= days
}

function formatTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
}

definePageMeta({
  middleware: ['auth'],
})

onMounted(async () => {
  notes.value = await $fetch('/api/notes')
  if (notes?.value?.length > 0) {
    selectNote(notes.value[0].id)
  }
})
</script>
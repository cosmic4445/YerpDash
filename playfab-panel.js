let currentUID = null;

function onPlayerSelected() {
  const select = document.getElementById("playerSelect");
  const uid    = select.value;
  if (!uid) { document.getElementById("selectedPlayer").style.display = "none"; currentUID = null; return; }
  const text = select.options[select.selectedIndex].text;
  currentUID = uid;
  document.getElementById("playerDisplayName").textContent = text.split("  —  ")[0];
  document.getElementById("playerIDLabel").textContent     = uid;
  document.getElementById("selectedPlayer").style.display  = "block";
}

async function modifyCurrency(action) {
  if (!currentUID) { setStatus("Select a player first.", "error"); return; }
  const amount = parseInt(document.getElementById("currencyAmount").value);
  if (!amount || amount <= 0) { setStatus("Enter a valid amount.", "error"); return; }

  setStatus(`${action === 'add' ? 'Adding' : 'Removing'} coins...`, "info");

  const endpoint = action === "add" ? "/Admin/AddUserVirtualCurrency" : "/Admin/SubtractUserVirtualCurrency";
  const res = await playfab(endpoint, {
    PlayFabId:      currentUID,
    VirtualCurrency: "CO",
    Amount:          amount
  });

  if (res.code === 200) setStatus(`${amount} coins ${action === 'add' ? 'added' : 'removed'}.`, "success");
  else setStatus("Failed: " + (res.errorMessage || "Unknown"), "error");
}

async function modifyItem(action) {
  if (!currentUID) { setStatus("Select a player first.", "error"); return; }
  const itemId = document.getElementById("itemId").value.trim();
  if (!itemId) { setStatus("Enter an item ID.", "error"); return; }

  setStatus(`${action === 'add' ? 'Adding' : 'Removing'} item...`, "info");

  if (action === "add") {
    const res = await playfab("/Admin/GrantItemsToUser", {
      PlayFabId:      currentUID,
      ItemIds:        [itemId],
      CatalogVersion: "main"
    });
    if (res.code === 200) setStatus(`Item "${itemId}" granted.`, "success");
    else setStatus("Failed: " + (res.errorMessage || "Unknown"), "error");
  } else {
    // Get inventory first to find instance ID
    const inv = await playfab("/Admin/GetUserInventory", { PlayFabId: currentUID });
    if (inv.code !== 200) { setStatus("Could not fetch inventory.", "error"); return; }
    const item = inv.data.Inventory.find(i => i.ItemId === itemId);
    if (!item) { setStatus(`Item "${itemId}" not found in player's inventory.`, "error"); return; }
    const res = await playfab("/Admin/RevokeInventoryItem", {
      PlayFabId:       currentUID,
      ItemInstanceId:  item.ItemInstanceId
    });
    if (res.code === 200) setStatus(`Item "${itemId}" removed.`, "success");
    else setStatus("Failed: " + (res.errorMessage || "Unknown"), "error");
  }
}

loadPlayers();
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Equipe;
use App\Models\User;

class EquipeController extends Controller
{
    // Lister toutes les équipes
    public function index()
    {
        return response()->json(Equipe::with('users')->get());
    }

    // Créer une nouvelle équipe
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $equipe = Equipe::create([
            'nom' => $request->nom,
        ]);

        return response()->json([
            'message' => 'Équipe créée avec succès',
            'equipe' => $equipe
        ]);
    }
    public function addUsers(Request $request, $id)
    {
        // Validation des utilisateurs envoyés
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id', // Vérifier que les utilisateurs existent
        ]);
    
        // Trouver l'équipe par ID
        $equipe = Equipe::findOrFail($id);
    
        // Vérifier les utilisateurs existants dans cette équipe
        $existingUsers = $equipe->users()->whereIn('user_id', $request->user_ids)->get();
    
        // Afficher les utilisateurs déjà associés pour debug
        \Log::info('Existing Users in the team', ['users' => $existingUsers]);
    
        // S'il y a des utilisateurs déjà associés, les ignorer (ou envoyer un message d'avertissement)
        $usersToAdd = array_diff($request->user_ids, $existingUsers->pluck('id')->toArray());
    
        // Afficher les utilisateurs qui seront ajoutés pour debug
        \Log::info('Users to be added to the team', ['users' => $usersToAdd]);
    
        // Si tous les utilisateurs sont déjà dans l'équipe
        if (empty($usersToAdd)) {
            return response()->json(['message' => 'Tous les utilisateurs sont déjà dans cette équipe.']);
        }
    
        // Ajouter les utilisateurs à l'équipe
        $equipe->users()->syncWithoutDetaching($usersToAdd);
    
        // Retourner un message de succès
        return response()->json(['message' => 'Utilisateurs ajoutés à l\'équipe']);
    }
    
    // Afficher une équipe spécifique
    public function show($id)
    {
        $equipe = Equipe::with('users')->findOrFail($id);
        return response()->json($equipe);
    }

    // Modifier une équipe
    public function update(Request $request, $id)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $equipe = Equipe::findOrFail($id);
        $equipe->update(['nom' => $request->nom]);

        return response()->json(['message' => 'Équipe mise à jour avec succès']);
    }

    // Supprimer une équipe
    public function destroy($id)
    {
        $equipe = Equipe::findOrFail($id);
        $equipe->delete();

        return response()->json(['message' => 'Équipe supprimée avec succès']);
    }
}

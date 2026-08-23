<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property int|null $created_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Activity extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
        'created_by',
    ];

    /**
     * Get the user who created this activity.
     *
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all status updates for this activity.
     *
     * @return HasMany<ActivityUpdate, $this>
     */
    public function updates(): HasMany
    {
        return $this->hasMany(ActivityUpdate::class, 'activity_id');
    }

    /**
     * Get the latest status update for this activity.
     *
     * @return HasOne<ActivityUpdate, $this>
     */
    public function latestUpdate(): HasOne
    {
        return $this->hasOne(ActivityUpdate::class, 'activity_id')->latestOfMany();
    }
}


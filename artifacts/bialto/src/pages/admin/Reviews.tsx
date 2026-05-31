import {
  useGetReviews, useUpdateReview, useDeleteReview,
  getGetReviewsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? "text-primary fill-primary" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const { data: allReviews = [] } = useGetReviews();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetReviewsQueryKey() });

  const approve = (id: number) => {
    updateReview.mutate({ id, data: { isApproved: true } }, { onSuccess: () => { invalidate(); toast({ title: "Review approved" }); } });
  };
  const reject = (id: number) => {
    updateReview.mutate({ id, data: { isApproved: false } }, { onSuccess: () => { invalidate(); toast({ title: "Review hidden" }); } });
  };
  const remove = (id: number) => {
    if (!confirm("Delete this review permanently?")) return;
    deleteReview.mutate({ id }, { onSuccess: () => { invalidate(); toast({ title: "Review deleted" }); } });
  };

  const pending = (allReviews as any[]).filter(r => !r.isApproved);
  const approved = (allReviews as any[]).filter(r => r.isApproved);

  const ReviewCard = ({ review }: { review: any }) => (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium">{review.guestName}</div>
          {review.guestLocation && <div className="text-xs text-muted-foreground">{review.guestLocation}</div>}
        </div>
        <div className="flex items-center gap-2">
          <StarRating rating={review.rating} />
          {review.isApproved
            ? <Badge className="bg-green-900/40 text-green-300 border-green-800">Published</Badge>
            : <Badge className="bg-yellow-900/40 text-yellow-300 border-yellow-800">Pending</Badge>
          }
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">"{review.reviewText}"</p>
      <div className="flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </div>
        <div className="flex gap-2">
          {!review.isApproved && (
            <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-green-900/20" onClick={() => approve(review.id)}>
              <Check className="w-4 h-4 mr-1" /> Approve
            </Button>
          )}
          {review.isApproved && (
            <Button variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20" onClick={() => reject(review.id)}>
              <X className="w-4 h-4 mr-1" /> Hide
            </Button>
          )}
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => remove(review.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif tracking-wide">Guest Reviews</h1>
        <p className="text-muted-foreground mt-1">Moderate and manage guest testimonials.</p>
      </div>

      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-medium flex items-center gap-2">
            Pending Moderation
            <Badge className="bg-yellow-900/40 text-yellow-300 border-yellow-800">{pending.length}</Badge>
          </h2>
          {pending.map((r: any) => <ReviewCard key={r.id} review={r} />)}
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-medium flex items-center gap-2">
          Published Reviews
          <Badge variant="secondary">{approved.length}</Badge>
        </h2>
        {approved.length === 0 && (
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-lg">No published reviews yet.</div>
        )}
        {approved.map((r: any) => <ReviewCard key={r.id} review={r} />)}
      </div>
    </div>
  );
}
